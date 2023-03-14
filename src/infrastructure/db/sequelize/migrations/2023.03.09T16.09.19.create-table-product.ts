import { DataTypes } from 'sequelize';
import type { Migration } from '../config/umzug';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('products', {
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
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        purchasePrice: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
        stock: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
        createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
        updateAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('products');
};