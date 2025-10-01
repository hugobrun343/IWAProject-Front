import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { KEYCLOAK_CONFIG } from '../config/keycloak';
import { User } from '../types/auth';

export class AuthService {
  static async openAuthSession(authUrl: string): Promise<string | null> {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        KEYCLOAK_CONFIG.redirectUri
      );

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        return url.searchParams.get('code');
      }
      return null;
    } catch (error) {
      console.error('Auth session error:', error);
      throw error;
    }
  }

  static async exchangeCodeForTokens(code: string, codeVerifier?: string): Promise<any> {
    try {
      const tokenUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;
      
      const bodyParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KEYCLOAK_CONFIG.clientId,
        code,
        redirect_uri: KEYCLOAK_CONFIG.redirectUri,
      });

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

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  static async fetchUserInfo(token: string): Promise<User> {
    try {
      const userInfoUrl = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/userinfo`;
      
      const response = await fetch(userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userInfo = await response.json();
        return this.mapUserInfo(userInfo);
      } else {
        // Fallback to token data
        return this.mapUserInfoFromToken(token);
      }
    } catch (error) {
      console.error('Fetch user info error:', error);
      // Fallback to token data
      return this.mapUserInfoFromToken(token);
    }
  }

  static async refreshAccessToken(refreshToken: string): Promise<any> {
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

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  private static mapUserInfo(userInfo: any): User {
    return {
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
      fullName: `${userInfo.given_name || userInfo.firstName || ''} ${userInfo.family_name || userInfo.lastName || ''}`.trim(),
      isVerified: userInfo.verification_identite === 'true' || userInfo.verification_identite === true,
    };
  }

  private static mapUserInfoFromToken(token: string): User {
    const decodedToken = jwtDecode<any>(token);
    return {
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
  }
}