const appRoutes = {
  dashboard: '/',
  route: {
    dashboard: '/route',
    create: '/route/create',
    edit: (routeId: string) => `/route/${routeId}/edit`,
  },
};

export default appRoutes;
