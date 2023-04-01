import { Router, Express } from "express";
import configurationRoutes from "./configurationRoutes";
export interface IRoute {
  pathName: string;
  controller: Router;
}
const routes: IRoute[] = [...configurationRoutes];

export default (app: Express) => {
  routes.forEach((item) => app.use(item?.pathName, item?.controller));
};
