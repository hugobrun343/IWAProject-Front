// Keycloak configuration
export const KEYCLOAK_CONFIG = {
  realm: 'Homeguard',
  clientId: 'homeguard-mobile',
  url: 'http://localhost:8080',
  
  // OAuth configuration
  redirectUri: 'guardhomereactnative://auth',
  
  // Scopes for authentication
  scopes: ['openid', 'profile', 'email'],
  
  // API endpoints
  endpoints: {
    auth: '/realms/Homeguard/protocol/openid-connect/auth',
    token: '/realms/Homeguard/protocol/openid-connect/token',
    logout: '/realms/Homeguard/protocol/openid-connect/logout',
    userInfo: '/realms/Homeguard/protocol/openid-connect/userinfo',
  }
};

// Helper function to build full URLs
export const buildKeycloakUrl = (endpoint: string): string => {
  return `${KEYCLOAK_CONFIG.url}${KEYCLOAK_CONFIG.endpoints[endpoint as keyof typeof KEYCLOAK_CONFIG.endpoints]}`;
};
