import { Request, Response } from "express";
import database_models from "../database/config/db.config";
const Role = database_models["role"];
const User = database_models["User"];
import { roleCreationAttributes } from "../database/models/role";

export const allRole = async (req: Request, res: Response) => {
	try {
		if (req.body) {
			const roles = await Role.findAll();

			return res.status(200).json({
				message: "we have following roles",
				roles: roles,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "internal server error",
			error: error,
		});
	}
};

export const createRole = async (req: Request, res: Response) => {
	try {
		if (req.body) {
			const exist = await Role.findOne({
				where: { roleName: req.body.roleName },
				raw: true,
			});
			if (exist) {
				return res.status(409).json({
					status: 409,
					message: "role already exist",
				});
			}
			const data: roleCreationAttributes = {
				roleName: req.body.roleName,
			};
			const role = await Role.create({ ...data });
			return res.status(201).json({
				message: "Role created successfully",
				response: role,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "internal server error",
			error: error,
		});
	}
};

export const assignRole = async (req: Request, res: Response) => {
	try {
		if (req.body) {
			const roleId = req.body.roleId;
			const userId = req.params.userId;
			const role = await Role.findOne({
				where: { id: roleId },
			});
			if (!role) {
				return res.status(404).json({
					status: 404,
					message: "role not found",
				});
			}
			await User.update({ role: roleId }, { where: { id: userId } });
			return res.status(201).json({
				message: "Role assigned successfully!",
				role: assignRole,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "internal server error",
			error: error,
		});
	}
};

export const updateRole = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const role = await Role.findOne({ where: { id }, raw: true });
		if (!role) {
			return res.status(404).json({ message: `Role with ${id} doesn't exist` });
		}
		await Role.update({ roleName: req.body.roleName }, { where: { id } });
		return res.status(201).json({ message: "Role updated successfully" });
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			error: error,
		});
	}
};
