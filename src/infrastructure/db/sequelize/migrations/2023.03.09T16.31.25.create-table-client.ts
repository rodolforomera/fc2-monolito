import { DataTypes } from 'sequelize';
import type { Migration } from '../config/umzug';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('clients', {
		id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        address: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
        createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
        updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('clients');
};