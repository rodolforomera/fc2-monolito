import { DataTypes } from 'sequelize';
import type { Migration } from '../config/umzug';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('invoices_items', {
		id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
		},
		invoice_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('invoices_items');
};