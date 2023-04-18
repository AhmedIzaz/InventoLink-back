import { IRoute } from "..";
import userRouter from "./userRoutes";
const configurationRoutes: IRoute[] = [
  {
    pathName: "/configuration/user",
    controller: userRouter,
  },
];

export default configurationRoutes;
