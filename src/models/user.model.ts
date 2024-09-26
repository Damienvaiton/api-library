import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données

export interface UserAttributes {
	id?: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public firstname!: string;
	public lastname!: string;
	public email!: string;
	public password!: string;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "User",
	}
);
