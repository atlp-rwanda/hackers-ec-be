import { NextFunction, Request, Response } from "express";
import { UserModelAttributes } from "../database/models/User";
import { generateAccessToken } from "../helpers/security.helpers";
import { HttpException } from "../utils/http.exception";
import passport from "../middlewares/passport";

interface InfoAttribute {
	message: string;
}

const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.body) {
			passport.authenticate(
				"signup",
				(err: Error, user: UserModelAttributes, info: InfoAttribute) => {
					if (!user) {
						return res
							.status(404)
							.json(new HttpException("NOT FOUND", info.message));
					}
					(req as any).login(user, async () => {
						if (err) {
							return res
								.status(400)
								.json(new HttpException("BAD REQUEST", "Bad Request!"));
						}
						const token = generateAccessToken({ id: user.id, role: user.role });
						const response = new HttpException(
							"SUCCESS",
							"Account Created successfully!",
						).response();
						res.status(201).json({ ...response, token });
					});
				},
			)(req, res, next);
		}
	} catch (error) {
		res
			.status(500)
			.json(new HttpException("SERVER ERROR", "Something went wrong!"));
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		"login",
		(error: Error, user: UserModelAttributes, info: InfoAttribute) => {
			if (error) {
				return res
					.status(400)
					.json(new HttpException("BAD REQUEST", "Bad Request!"));
			}

      if (info)
        return res
          .status(404)
          .json(new HttpException("NOT FOUND", info.message));

			(req as any).login(user, (err: Error) => {
				if (err) {
					return res
						.status(400)
						.json(new HttpException("BAD REQUEST", "Bad Request!"));
				}

				const { id, role } = user;

        const token = generateAccessToken({ id, role });
        const response = new HttpException(
          "SUCCESS",
          "Logged in to your account successfully!"
        ).response();
        return res.status(200).json({ ...response, token });
      });
    }
  )(req, res, next);
};

export default {
	login,
	registerUser,
};
