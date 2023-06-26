import { Request, Response } from "express";
import { globalPrisma } from "../../../..";
export const create_business_unit = async (req: Request, res: Response) => {
  try {
  
    const duplicateBusinessUnit =
      await globalPrisma.master_business_unit.findFirst({
        where: {
          account_id: req.body.account_id,
          business_unit_name: req.body.businessUnitName,
        },
      });
   
    if (duplicateBusinessUnit)
      return res
        .status(400)
        .json({ message: "Business unit already exists!" })
        .end();
    await globalPrisma.master_business_unit.create({
      data: {
        business_unit_name: req.body.businessUnitName,
        account_id: req.body.account_id,
        base_currency_id: req.body.baseCurrency?.value,
        language: req.body.language,
      },
    });
    return res
      .json({ message: "Business unit created successfully" })
      .status(200)
      .end();
  } catch (error: Error | any) {
    console.log(error);
    return res.status(500).json({ message: error.message }).end();
  }
};
