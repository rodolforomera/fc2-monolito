import { DataTypes } from 'sequelize';
import type { Migration } from '../config/umzug';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('transactions', {
		id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
		},
		order_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
        status: {
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
	await sequelize.getQueryInterface().dropTable('transactions');
};