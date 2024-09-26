import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Route,
	Tags,
	Query,
} from "tsoa";
import { UserDTO } from "../dto/user.dto";
import { userService } from "../services/user.service";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
	@Get("/")
	public async getAllUsers(): Promise<UserDTO[]> {
		return userService.getAllUsers();
	}

	@Post("/")
	public async createUser(@Body() requestBody: UserDTO): Promise<UserDTO> {
		return userService.createUser(requestBody);
	}

	@Post("/login")
	public async login(
		@Query() login: string,
		@Query() password: string
	): Promise<UserDTO> {
		return userService.login(login, password);
	}

	@Get("/exists")
	public async userExists(@Query() email: string): Promise<boolean> {
		return userService.userExists(email);
	}

	@Delete("/{id}")
	public async deleteUser(id: number): Promise<void> {
		await userService.deleteUser(id);
	}

	@Patch("/{id}")
	public async updateUser(
		id: number,
		@Body() requestBody: UserDTO
	): Promise<UserDTO | null> {
		return userService.updateUser(id, requestBody);
	}
}
