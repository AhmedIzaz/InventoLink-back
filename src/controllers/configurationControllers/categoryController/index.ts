import { Request, Response } from "express";
import { ICategory } from "../../../../interfaces/configurationInterfaces";
import { globalPrisma } from "../../..";

export const createCategory = async (
  req: Request<{}, {}, ICategory>,
  res: Response
) => {
  try {
    const { category_name, description } = req.body;
    console.log(category_name, description);
    return res.send("Created Successfully").status(200).end();
  } catch (e: Error | any) {
    return res.json({ message: e.message }).end();
  }
};
