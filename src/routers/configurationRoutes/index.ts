import { IRoute } from "..";
import categoryRouter from "./categoryRoutes";
import userRouter from "./userRoutes";
const configurationRoutes: IRoute[] = [
  {
    pathName: "/configuration/category",
    controller: categoryRouter,
  },
  {
    pathName: "/configuration/user",
    controller: userRouter,
  },
];

export default configurationRoutes;
