import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

// Configure WebBrowser for better UX
WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  telephone: string;
  localisation: string;
  description?: string;
  photo_profil?: string;
  verification_identite: boolean;
  preferences?: string;
  date_inscription: string;
  // Computed fields
  fullName: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateUserAttribute: (attribute: string, value: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keycloak configuration
const KEYCLOAK_CONFIG = {
  realm: 'Homeguard',
  clientId: 'guardhome-mobile', // Use your mobile client ID
  url: 'https://homeguard-keycloak.cluster-ig5.igpolytech.fr/realms/Homeguard/account',
  redirectUri: 'exp://192.168.1.151:8081',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);

  const isAuthenticated = !!user && !!accessToken;

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if we have stored tokens
      const storedAccessToken = await getStoredToken('access_token');
      const storedRefreshToken = await getStoredToken('refresh_token');

      if (storedAccessToken) {
        const decodedToken = jwtDecode<any>(storedAccessToken);
        
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setAccessToken(storedAccessToken);
          setRefreshTokenValue(storedRefreshToken);
          
          // Extract user info from token
          const userInfo: User = {
            id: decodedToken.sub,
            email: decodedToken.email || '',
            firstName: decodedToken.given_name || decodedToken.firstName || '',
            lastName: decodedToken.family_name || decodedToken.lastName || '',
            username: decodedToken.preferred_username || decodedToken.username || '',
            telephone: decodedToken.telephone || '',
            localisation: decodedToken.localisation || '',
            description: decodedToken.description,
            photo_profil: decodedToken.picture || decodedToken.photo_profil,
            verification_identite: decodedToken.verification_identite === 'true' || decodedToken.verification_identite === true,
            preferences: decodedToken.preferences,
            date_inscription: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : new Date().toISOString(),
            fullName: `${decodedToken.given_name || decodedToken.firstName || ''} ${decodedToken.family_name || decodedToken.lastName || ''}`.trim(),
            isVerified: decodedToken.verification_identite === 'true' || decodedToken.verification_identite === true,
          };
          setUser(userInfo);
        } else if (storedRefreshToken) {
          // Try to refresh token
          await refreshAccessToken(storedRefreshToken);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);

      // Generate code verifier and challenge for PKCE
      const codeVerifier = Math.random().toString(36) + Date.now().toString(36);
      
      const codeChallenge = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        codeVerifier,
        { encoding: Crypto.CryptoEncoding.BASE64 }
      );

      // Store code verifier for later use
      await storeToken('code_verifier', codeVerifier);

      // Build authorization URL with Google as preferred provider
      const authUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/auth?` +
        `client_id=${KEYCLOAK_CONFIG.clientId}&` +
        `redirect_uri=${encodeURIComponent(KEYCLOAK_CONFIG.redirectUri)}&` +
        `response_type=code&` +
        `scope=openid profile email&` +
        `code_challenge=${codeChallenge}&` +
        `code_challenge_method=S256&` +
        `kc_idp_hint=google`; // Pre-select Google login

      // Open browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        KEYCLOAK_CONFIG.redirectUri
      );

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (code) {
          await exchangeCodeForTokens(code, codeVerifier);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Direct Google login URL
      const googleAuthUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/broker/google/login?` +
        `client_id=${KEYCLOAK_CONFIG.clientId}&` +
        `redirect_uri=${encodeURIComponent(KEYCLOAK_CONFIG.redirectUri)}&` +
        `response_type=code&` +
        `scope=openid profile email`;

      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        KEYCLOAK_CONFIG.redirectUri
      );

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (code) {
          // For Google login, we don't need PKCE
          await exchangeCodeForTokens(code, '');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeCodeForTokens = async (code: string, codeVerifier: string) => {
    try {
      const tokenUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;
      
      const bodyParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KEYCLOAK_CONFIG.clientId,
        code,
        redirect_uri: KEYCLOAK_CONFIG.redirectUri,
      });

      // Add PKCE parameters if codeVerifier is provided
      if (codeVerifier) {
        bodyParams.append('code_verifier', codeVerifier);
      }

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams,
      });

      const data = await response.json();

      if (data.access_token) {
        setAccessToken(data.access_token);
        setRefreshTokenValue(data.refresh_token);

        // Store tokens securely
        await storeToken('access_token', data.access_token);
        await storeToken('refresh_token', data.refresh_token);

        // Get user info from Keycloak
        await fetchUserInfo(data.access_token);
      }
    } catch (error) {
      console.error('Token exchange error:', error);
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const userInfoUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/userinfo`;
      
      const response = await fetch(userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userInfo = await response.json();
      
      const user: User = {
        id: userInfo.sub,
        email: userInfo.email || '',
        firstName: userInfo.given_name || userInfo.firstName || '',
        lastName: userInfo.family_name || userInfo.lastName || '',
        username: userInfo.preferred_username || userInfo.username || '',
        telephone: userInfo.telephone || '',
        localisation: userInfo.localisation || '',
        description: userInfo.description,
        photo_profil: userInfo.picture || userInfo.photo_profil,
        verification_identite: userInfo.verification_identite === 'true' || userInfo.verification_identite === true,
        preferences: userInfo.preferences,
        date_inscription: userInfo.created_timestamp ? new Date(userInfo.created_timestamp * 1000).toISOString() : new Date().toISOString(),
        // Computed fields
        fullName: `${userInfo.given_name || userInfo.firstName || ''} ${userInfo.family_name || userInfo.lastName || ''}`.trim(),
        isVerified: userInfo.verification_identite === 'true' || userInfo.verification_identite === true,
      };
      
      setUser(user);
    } catch (error) {
      console.error('Fetch user info error:', error);
      // Fallback to token data
      const decodedToken = jwtDecode<any>(token);
      const user: User = {
        id: decodedToken.sub,
        email: decodedToken.email || '',
        firstName: decodedToken.given_name || decodedToken.firstName || '',
        lastName: decodedToken.family_name || decodedToken.lastName || '',
        username: decodedToken.preferred_username || decodedToken.username || '',
        telephone: decodedToken.telephone || '',
        localisation: decodedToken.localisation || '',
        description: decodedToken.description,
        photo_profil: decodedToken.picture || decodedToken.photo_profil,
        verification_identite: decodedToken.verification_identite === 'true' || decodedToken.verification_identite === true,
        preferences: decodedToken.preferences,
        date_inscription: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : new Date().toISOString(),
        fullName: `${decodedToken.given_name || decodedToken.firstName || ''} ${decodedToken.family_name || decodedToken.lastName || ''}`.trim(),
        isVerified: decodedToken.verification_identite === 'true' || decodedToken.verification_identite === true,
      };
      setUser(user);
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const tokenUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: KEYCLOAK_CONFIG.clientId,
          refresh_token: refreshToken,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        setAccessToken(data.access_token);
        setRefreshTokenValue(data.refresh_token);

        // Store new tokens
        await storeToken('access_token', data.access_token);
        await storeToken('refresh_token', data.refresh_token);

        // Get updated user info
        await fetchUserInfo(data.access_token);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  const refreshToken = async () => {
    if (refreshTokenValue) {
      await refreshAccessToken(refreshTokenValue);
    }
  };

  const logout = async () => {
    try {
      // Clear stored tokens
      await removeStoredToken('access_token');
      await removeStoredToken('refresh_token');
      await removeStoredToken('code_verifier');

      // Clear state
      setUser(null);
      setAccessToken(null);
      setRefreshTokenValue(null);

      // Optional: Logout from Keycloak
      const logoutUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/logout?` +
        `client_id=${KEYCLOAK_CONFIG.clientId}&` +
        `redirect_uri=${encodeURIComponent(KEYCLOAK_CONFIG.redirectUri)}`;

      await WebBrowser.openAuthSessionAsync(logoutUrl, KEYCLOAK_CONFIG.redirectUri);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!accessToken) return;

    try {
      const userInfoUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/userinfo`;
      
      const response = await fetch(userInfoUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // Update local user state
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const updateUserAttribute = async (attribute: string, value: any) => {
    if (!accessToken) return;

    try {
      // Use Keycloak Admin API to update user attributes
      const userId = user?.id;
      const adminUrl = `${KEYCLOAK_CONFIG.url}/admin/realms/${KEYCLOAK_CONFIG.realm}/users/${userId}`;
      
      // For preferences, stringify if it's an object
      const finalValue = attribute === 'preferences' && typeof value === 'object' 
        ? JSON.stringify(value) 
        : value;

      const response = await fetch(adminUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attributes: {
            [attribute]: [finalValue]
          }
        }),
      });

      if (response.ok) {
        // Update local user state
        setUser(prev => {
          if (!prev) return null;
          
          const updatedUser = { ...prev };
          (updatedUser as any)[attribute] = value;
          
          // Update computed fields
          if (attribute === 'firstName' || attribute === 'lastName') {
            updatedUser.fullName = `${updatedUser.firstName} ${updatedUser.lastName}`.trim();
          }
          if (attribute === 'verification_identite') {
            updatedUser.isVerified = value;
          }
          
          return updatedUser;
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user attribute error:', error);
      return false;
    }
  };

  // Secure token storage using Expo SecureStore
  const storeToken = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Store token error:', error);
    }
  };

  const getStoredToken = async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Get stored token error:', error);
      return null;
    }
  };

  const removeStoredToken = async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Remove stored token error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    refreshToken,
    updateUserProfile,
    updateUserAttribute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
