import { Request, Response } from "express";
import { IUser } from "../../../../../interfaces/configurationInterfaces";
import { globalPrisma } from "../../../../index";
import bcrypt from "bcrypt";
import { user } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
export const user_signup = async (
  req: Request<{}, {}, user>,
  res: Response
) => {
  try {
    const {
      email,
      password: givenPassword,
      username,
      account_id,
      user_type_id,
    } = req.body;
    if (!email || !givenPassword || !username)
      return res
        .status(400)
        .json({ message: "email, password or name is missing" })
        .end();
    const user_exist = await globalPrisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user_exist)
      return res.status(400).json({ message: "user already exist" }).end();

    const encryptedPassword = await bcrypt.hash(givenPassword, 10);
    await globalPrisma.user.create({
      data: {
        email,
        password: encryptedPassword,
        username,
        account_id,
        user_type_id,
      },
    });
    return res.status(200).json({ message: "User created successfully" }).end();
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message }).end();
  }
};

export const user_login = async (
  req: Request<{}, {}, IUser>,
  res: Response
) => {
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
        employee: {
          select: {
            id: true,
            employee_name: true,
            employee_code: true,
            mobile_number: true,
            official_email: true,
            personal_email: true,
            profile_picture_id: true,
            department: {
              select: {
                id: true,
                department_name: true,
              },
            },
            designation: {
              select: {
                id: true,
                designation_name: true,
              },
            },
            workplace: {
              select: {
                id: true,
                workplace_name: true,
              },
            },
            master_account: {
              select: {
                id: true,
                account_name: true,
              },
            },
            master_business_unit: {
              select: {
                id: true,
                business_unit_name: true,
              },
            },
          },
        },
        username: true,
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

    const { password, id, email, username, ...userInfoWithoutPassword } = user;
    const { employee } = userInfoWithoutPassword;
    const token = jsonwebtoken.sign(
      {
        userId: id,
        employeeId: employee?.id,
        userName: username,
        employeeName: employee?.employee_name,
      },
      process.env.JWT_SECRET_KEY || "secret key",
      {
        expiresIn: "2 days",
      }
    );
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
        token,
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
              is_active: true,
            },
          },
        },
      }
    );
    const formattedMenu = user_permitted_menu.map((item) => item.menu);
    const parentMenuList = formattedMenu?.filter(
      (item) => item?.is_first_level && item?.is_active
    );
    if (parentMenuList?.length < 1) {
      return res.status(404).json({ message: "No menu found" }).end();
    }
    const formattedMenuWithSecondLevelMenu = parentMenuList?.map((item) => {
      return {
        ...item,
        second_level_menu: formattedMenu?.filter(
          (nestedItem) =>
            nestedItem?.is_second_level &&
            nestedItem?.parent_menu_id === item?.id &&
            item?.has_sub_menu &&
            nestedItem?.is_active
        ),
      };
    });
    const formattedWithThirdLevelMenu = formattedMenuWithSecondLevelMenu?.map(
      (item) => ({
        ...item,
        second_level_menu: item?.second_level_menu?.map((nestedItem) => ({
          ...nestedItem,
          third_level_menu: formattedMenu?.filter(
            (multiNested) =>
              multiNested?.parent_menu_id === nestedItem?.id &&
              multiNested?.is_third_level &&
              multiNested?.is_active
          ),
        })),
      })
    );

    return res.status(200).json(formattedWithThirdLevelMenu).end();
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message }).end();
  }
};
