// import { EXCEPTION_COMPONENT, LAYOUT } from "./constant";

// export const ROUTE_MAP ={
//   Dashboard: LAYOUT,
//   Analysis: () => import('/@/views/dashboard/analysis/index.vue'),
//   Workbench: () => import('@/views/dashboard/workbench/index.vue'),
//   NOT_FOUND: () => EXCEPTION_COMPONENT
// };

import { asyncRoutes } from "./routes";

const newRoutes = {};

function generrateMap (routes) {
  return routes.map((route) => {
    if (route.children && route.children.length > 0) {
      generrateMap(route.children);
    }
    newRoutes[route.name] = route.component;
  })
}

generrateMap(asyncRoutes)
export const ROUTE_MAP = newRoutes;