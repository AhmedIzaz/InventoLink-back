import { IRoute } from "..";
import userRouter from "./userRoutes";
import currencyRouter from "./currencyRoutes";
const configurationRoutes: IRoute[] = [
  {
    pathName: "/configuration/user",
    controller: userRouter,
  },
  {
    pathName: "/configuration/currency",
    controller: currencyRouter,
  },
];

export default configurationRoutes;
