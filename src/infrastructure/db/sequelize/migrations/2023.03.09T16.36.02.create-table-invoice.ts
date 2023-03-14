import { DataTypes } from 'sequelize';
import type { Migration } from '../config/umzug';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('invoices', {
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
        document: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        street: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        complement: {
			type: DataTypes.STRING,
			allowNull: true,
		},
        city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        state: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        zipcode: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		total: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},       
        createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		}
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('invoices');
};