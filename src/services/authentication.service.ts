import { User } from "../models/user.model"; // Modèle Sequelize
import jwt from "jsonwebtoken"; // Pour générer le JWT
import { Buffer } from "buffer"; // Pour décoder Base64
import { notFound } from "../error/NotFoundError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Clé secrète pour signer le token

interface Permissions {
	author: string[];
	book: string[];
	bookCollection: string[];
}


const adminPermissions = {
	"author:read": true,
	"author:create": true,
	"author:update": true,
	"author:delete": true,
	"book:read": true,
	"book:create": true,
	"book:update": true,
	"book:delete": true,
	"bookCollection:read": true,
	"bookCollection:create": true,
	"bookCollection:update": true,
	"bookCollection:delete": true,
};

const gerantPermissions = {
	"author:read": true,
	"author:create": true,
	"author:update": true,
	"book:read": true,
	"book:create": true,
	"book:update": true,
	"bookCollection:read": true,
	"bookCollection:create": true,
	"bookCollection:update": true,
	"bookCollection:delete": true,
};

const userPermissions = {
	"author:read": true,
	"book:read": true,
	"book:create": true,
	"bookCollection:read": true,
};

export class AuthenticationService {
	public async authenticate(
		username: string,
		password: string
	): Promise<string> {
		// Recherche l'utilisateur dans la base de données
		const user = await User.findOne({ where: { username } });

		if (!user) {
			throw notFound("User");
		}

		// Décoder le mot de passe stocké en base de données
		const decodedPassword = Buffer.from(user.password, "base64").toString(
			"utf-8"
		);

		// Vérifie si le mot de passe est correct
		if (password === decodedPassword) {
			// Si l'utilisateur est authentifié, on génère un JWT
			const generatedToken = (username: string) => {
				let token = "";
				if (username == "admin") {
					token = jwt.sign(
						{ username: user.username, scopes: adminPermissions },
						JWT_SECRET,
						{
							expiresIn: "1h",
						}
					);
				} else if (username == "gerant") {
					token = jwt.sign(
						{ username: user.username, scopes: gerantPermissions },
						JWT_SECRET,
						{
							expiresIn: "1h",
						}
					);
				} else if (username == "utilisateur") {
					token = jwt.sign(
						{ username: user.username, scopes: userPermissions },
						JWT_SECRET,
						{
							expiresIn: "1h",
						}
					);
				}

				return token;
			};

			return generatedToken(user.username);
		} else {
			let error = new Error("Wrong password");
			(error as any).status = 403;
			throw error;
		}
	}
}

export const authService = new AuthenticationService();
