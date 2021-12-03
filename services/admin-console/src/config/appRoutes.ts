const appRoutes = {
  dashboard: '/',
  route: {
    dashboard: '/route',
    create: '/route/create',
    edit: (routeId: string) => `/route/${routeId}/edit`,
    clone: (routeId: string) => `/route/${routeId}/clone`,
  },
  waypoint: {
    dashboard: '/waypoint',
    create: '/waypoint/create',
  },
  bpa: {
    dashboard: '/bpa/report',
    zone: '/bpa/zone',
    provider: '/bpa/provider',
    report: '/bpa/report',
  },
};

export default appRoutes;
