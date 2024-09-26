import { UserDTO } from "../dto/user.dto";
import { User } from "../models/user.model";

export class UserService {
	// Recupere tous les utilisateurs
	public async getAllUsers(): Promise<UserDTO[]> {
		return User.findAll();
	}

	public async createUser(requestBody: UserDTO): Promise<UserDTO> {
		return User.create({
			firstname: requestBody.firstname,
			lastname: requestBody.lastname,
			email: requestBody.email,
			password: Buffer.from(requestBody.password).toString("base64"),
		});
	}

	public async login(login: string, password: string): Promise<UserDTO> {
		const user = await User.findOne({
			where: {
				email: login,
				password: Buffer.from(password).toString("base64"),
			},
		});
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	public async userExists(email: string): Promise<boolean> {
		const user = await User.findOne({
			where: {
				email: email,
			},
		});
		return user !== null;
	}

	public async deleteUser(id: number): Promise<void> {
		const user = await User.findByPk(id);
		if (user) {
			await user.destroy();
		}
	}

	public async updateUser(
		id: number,
		requestBody: UserDTO
	): Promise<UserDTO | null> {
		const user = await User.findByPk(id);
		if (!user) {
			return null;
		}
		if (requestBody.firstname) user.firstname = requestBody.firstname;
		if (requestBody.lastname) user.lastname = requestBody.lastname;
		if (requestBody.email) user.email = requestBody.email;
		if (requestBody.password)
			user.password = Buffer.from(requestBody.password).toString("base64");
		await user.save();
		return user;
	}
}

export const userService = new UserService();
