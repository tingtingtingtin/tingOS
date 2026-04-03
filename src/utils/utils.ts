export const isRouteActive = (pathname: string, route: string) => {
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
};
