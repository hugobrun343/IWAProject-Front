import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { KEYCLOAK_CONFIG } from '../config/keycloak';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { storeToken, getStoredToken, clearAllTokens } from '../utils/tokenStorage';
import { User } from '../types/auth';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const buildAuthUrl = (useGoogle = false) => {
    const baseUrl = useGoogle 
      ? `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/broker/google/login`
      : `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/auth`;

    const params = new URLSearchParams({
      client_id: KEYCLOAK_CONFIG.clientId,
      redirect_uri: KEYCLOAK_CONFIG.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
    });

    if (!useGoogle) {
      params.append('kc_idp_hint', 'google');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const performLogin = async (useGoogle = false): Promise<{ user: User | null; tokens: any }> => {
    try {
      setIsLoading(true);

      const authUrl = buildAuthUrl(useGoogle);
      const code = await AuthService.openAuthSession(authUrl);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokens = await AuthService.exchangeCodeForTokens(code);

      if (!tokens.access_token) {
        throw new Error('No access token received');
      }

      // Store tokens securely
      await storeToken('access_token', tokens.access_token);
      await storeToken('refresh_token', tokens.refresh_token);

      // Get user info
      const user = await AuthService.fetchUserInfo(tokens.access_token);

      return { user, tokens };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const performLogout = async (): Promise<void> => {
    try {
      // Clear stored tokens
      await clearAllTokens();

      // Optional: Logout from Keycloak
      const logoutUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/logout?` +
        `client_id=${KEYCLOAK_CONFIG.clientId}&` +
        `redirect_uri=${encodeURIComponent(KEYCLOAK_CONFIG.redirectUri)}`;

      await WebBrowser.openAuthSessionAsync(
        logoutUrl,
        KEYCLOAK_CONFIG.redirectUri
      );
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const performTokenRefresh = async (refreshToken: string): Promise<{ user: User | null; tokens: any }> => {
    try {
      const tokens = await AuthService.refreshAccessToken(refreshToken);

      if (!tokens.access_token) {
        throw new Error('Failed to refresh token');
      }

      // Store new tokens
      await storeToken('access_token', tokens.access_token);
      await storeToken('refresh_token', tokens.refresh_token);

      // Get updated user info
      const user = await AuthService.fetchUserInfo(tokens.access_token);

      return { user, tokens };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  };

  const initializeFromStorage = async (): Promise<{ user: User | null; tokens: any }> => {
    try {
      const storedAccessToken = await getStoredToken('access_token');
      const storedRefreshToken = await getStoredToken('refresh_token');

      if (!storedAccessToken) {
        return { user: null, tokens: null };
      }

      const decodedToken = jwtDecode<any>(storedAccessToken);

      // Check if token is expired
      if (decodedToken.exp * 1000 > Date.now()) {
        const user = await AuthService.fetchUserInfo(storedAccessToken);
        return { 
          user, 
          tokens: { 
            access_token: storedAccessToken, 
            refresh_token: storedRefreshToken 
          } 
        };
      } else if (storedRefreshToken) {
        // Try to refresh token
        return await performTokenRefresh(storedRefreshToken);
      }

      return { user: null, tokens: null };
    } catch (error) {
      console.error('Initialize from storage error:', error);
      return { user: null, tokens: null };
    }
  };

  const performUpdateProfile = async (accessToken: string, updates: Partial<User>): Promise<boolean> => {
    return await UserService.updateUserProfile(accessToken, updates);
  };

  const performUpdateAttribute = async (accessToken: string, userId: string, attribute: string, value: any): Promise<boolean> => {
    return await UserService.updateUserAttribute(accessToken, userId, attribute, value);
  };

  return {
    isLoading,
    performLogin,
    performLogout,
    performTokenRefresh,
    initializeFromStorage,
    performUpdateProfile,
    performUpdateAttribute,
  };
};