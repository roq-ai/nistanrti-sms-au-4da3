const mapping: Record<string, string> = {
  authentications: 'authentication',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
