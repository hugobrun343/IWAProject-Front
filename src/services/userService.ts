import { KEYCLOAK_CONFIG } from '../config/keycloak';
import { User } from '../types/auth';

export class UserService {
  static async updateUserProfile(accessToken: string, updates: Partial<User>): Promise<boolean> {
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

      return response.ok;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }

  static async updateUserAttribute(accessToken: string, userId: string, attribute: string, value: any): Promise<boolean> {
    try {
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

      return response.ok;
    } catch (error) {
      console.error('Update user attribute error:', error);
      return false;
    }
  }
}