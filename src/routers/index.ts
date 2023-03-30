import { RouterOptions, IRouter } from "express";
import itemRoutes from "./configurationRoutes/itemRoutes";

// interface IRoute{
//     pathName:string,
//     controller:IRouter
// }
const routes = [
  {
    pathname: "/item",
    controller: itemRoutes,
  },
];

export default (app: any) => {
  routes.forEach((item) => app.use(item?.pathname, item?.controller));
};
