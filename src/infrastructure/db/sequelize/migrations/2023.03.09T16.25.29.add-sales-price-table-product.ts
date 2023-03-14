import { DataTypes } from 'sequelize';
import type { Migration } from '../config/umzug';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn('products', 'salesPrice', {
        type: DataTypes.DECIMAL,
        allowNull: true,
    });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn('products', 'salesPrice')
};