import { IRoute } from "..";
import categoryRouter from "./categoryRoutes";
const configurationRoutes: IRoute[] = [
  {
    pathName: "/configuration/category",
    controller: categoryRouter,
  },
];

export default configurationRoutes;
