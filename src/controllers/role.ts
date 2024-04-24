import { Request, Response } from "express";
import { Role } from "../database/models/roles";
import { roleCreationAttributes } from "../database/models/roles";
import { User } from "../database/models/User";
import { userRole } from "../database/models/userroles";

export const createRole = async (req: Request, res: Response) => {
	try {
		if (req.body) {
			const exist = await Role.findOne({
				where: { roleName: req.body.roleName },
			});
			const data: roleCreationAttributes = {
				roleName: req.body.roleName,
				permission: req.body.permission,
			};
			if (exist) {
				return res.status(409).json({
					status: 409,
					message: "role already exist",
				});
			}
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
      const roleName=req.body.roleName;
			const userId = req.params.userId;
			const user = await User.findOne({
				where: { id: userId },
			});

			if (!user) {
				return res.status(404).json({
					status: 404,
					message: "User not found",
				});
			}

			const role = await Role.findOne({
				where: { id: roleId },
			});
			if (!role) {
				return res.status(404).json({
					status: 404,
					message: "role not found",
				});
			}
			const data = {
				userId: userId,
				roleId: roleId,
        roleName:roleName
			};
			const userHaveRole = await userRole.findOne({
				where: {
					userId: userId,
					roleId: roleId,
				},
			});
			if (userHaveRole) {
				return res.status(409).json({
					status: 409,
					message: "user have already this role",
				});
			}
			const assignRole = await userRole.create({ ...data });
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
		const role = await Role.findOne({ where: { id } });
		if (!role) {
			return res
				.status(404)
				.json({ message: `Role witth ${id} doesn't exist` });
		}
		await Role.update(
			{ roleName: req.body.roleName, permission: req.body.permission },
			{ where: { id } },
		);
		return res.status(201).json({ message: "Role updated successfully" });
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			error: error,
		});
	}
};

export const deleteRole = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const role = await Role.findOne({ where: { id } });
		if (!role) {
			return res
				.status(404)
				.json({ message: `Role witth ${id} doesn't exist` });
		}
		await userRole.destroy({ where: { roleId: id } });
		await Role.destroy({ where: { id } });
		return res.status(200).json({ message: "Role deleted successfully" });
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			error: error,
		});
	}
};
