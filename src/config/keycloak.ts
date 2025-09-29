// Keycloak configuration
export const KEYCLOAK_CONFIG = {
  realm: 'master',
  clientId: 'homeguard-frontend',
  url: 'https://homeguard-keycloak.cluster-ig5.igpolytech.fr',
  
  // OAuth configuration
  redirectUri: 'guardhomereactnative://auth',
  
  // Scopes for authentication
  scopes: ['openid', 'profile', 'email'],
  
  // API endpoints
  endpoints: {
    auth: '/realms/master/protocol/openid-connect/auth',
    token: '/realms/master/protocol/openid-connect/token',
    logout: '/realms/master/protocol/openid-connect/logout',
    userInfo: '/realms/master/protocol/openid-connect/userinfo',
  }
};

// Helper function to build full URLs
export const buildKeycloakUrl = (endpoint: string): string => {
  return `${KEYCLOAK_CONFIG.url}${KEYCLOAK_CONFIG.endpoints[endpoint as keyof typeof KEYCLOAK_CONFIG.endpoints]}`;
};
