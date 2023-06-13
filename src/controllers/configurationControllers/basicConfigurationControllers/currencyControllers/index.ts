import { globalPrisma } from "../../../..";
import { Request, Response } from "express";
export const get_all_currencies_ddl = async (_: Request, res: Response) => {
  try {
    const all_currencies = await globalPrisma.master_currency.findMany();
    const currency_ddl = all_currencies.map((item) => ({
      label: item?.currency_name,
      value: item?.id,
    }));
    return res.status(200).json(currency_ddl).end();
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message }).end();
  }
};
