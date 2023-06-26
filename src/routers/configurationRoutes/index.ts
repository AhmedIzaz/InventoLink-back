import { IRoute } from "..";
import userRouter from "./userRoutes";
import currencyRouter from "./currencyRoutes";
import businessUnitRoutes from "./businessUnitRoutes";
const configurationRoutes: IRoute[] = [
  {
    pathName: "/configuration/user",
    controller: userRouter,
  },
  {
    pathName: "/configuration/currency",
    controller: currencyRouter,
  },
  {
    pathName: "/configuration/business-unit",
    controller: businessUnitRoutes,
  },
];

export default configurationRoutes;
