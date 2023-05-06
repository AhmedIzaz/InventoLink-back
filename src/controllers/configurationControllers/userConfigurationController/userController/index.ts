import { Request, Response } from "express";
import { IUser } from "../../../../../interfaces/configurationInterfaces";
import { globalPrisma } from "../../../../index";
import bcrypt from "bcrypt";
export const userLogin = async (req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const { email: givenEmail, password: givenPassword } = req.body;
    if (!givenEmail || !givenPassword)
      return res
        .status(400)
        .json({ message: "email or password is missing" })
        .end();
    const user = await globalPrisma.user.findFirst({
      where: {
        email: givenEmail,
      },
      select: {
        id: true,
        email: true,
        password: true,
        employee: true,
        user_permitted_business_unit: {
          select: {
            master_business_unit: {
              select: {
                business_unit_name: true,
                id: true,
              },
            },
          },
        },
      },
    });
    if (!user) return res.status(404).json({ message: "user not found" }).end();
    const passwordMatched = await bcrypt.compare(givenPassword, user.password);
    if (!passwordMatched)
      return res.status(400).json({ message: "password is incorrect" }).end();

    const { password, id, email, ...userInfoWithoutPassword } = user;
    const { employee } = userInfoWithoutPassword;
    const permittedBusinessUnitDDL = user?.user_permitted_business_unit?.map(
      (item) => ({
        label: item?.master_business_unit?.business_unit_name,
        value: item?.master_business_unit?.id,
      })
    );
    return res
      .status(200)
      .json({
        message: "Login successful",
        userInformation: {
          id,
          email,
        },
        employeeInformation: employee,
        permittedBusinessUnitDDL,
      })
      .end();
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message }).end();
  }
};

export const get_user_permitted_business_unit_menu = async (
  req: Request<{}, {}, {}, { user_id: string; business_unit_id: string }>,
  res: Response
) => {
  const { user_id, business_unit_id } = req.query;
  try {
    const user_permitted_menu = await globalPrisma.user_permitted_menu.findMany(
      {
        where: {
          user_id: +user_id || 0,
          business_unit_id: +business_unit_id || 0,
        },
        select: {
          menu: {
            select: {
              id: true,
              parent_menu_id: true,
              title: true,
              label: true,
              is_first_level: true,
              is_second_level: true,
              is_third_level: true,
              path: true,
              has_sub_menu: true,
            },
          },
        },
      }
    );
    const formattedMenu = user_permitted_menu.map((item) => item.menu);
    return res.status(200).json(formattedMenu).end();
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message }).end();
  }
};
