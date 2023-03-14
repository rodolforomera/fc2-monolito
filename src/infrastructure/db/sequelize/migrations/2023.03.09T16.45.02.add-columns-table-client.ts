import { DataTypes } from 'sequelize';
import type { Migration } from '../config/umzug';

export const up: Migration = async ({ context: sequelize }) => {
	
	await sequelize.getQueryInterface().removeColumn('clients', 'address');

	await sequelize.getQueryInterface().addColumn('clients', 'document', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });
	await sequelize.getQueryInterface().addColumn('clients', 'street', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });
	await sequelize.getQueryInterface().addColumn('clients', 'number', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });
	await sequelize.getQueryInterface().addColumn('clients', 'complement', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });
	await sequelize.getQueryInterface().addColumn('clients', 'city', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });
	await sequelize.getQueryInterface().addColumn('clients', 'state', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });
	await sequelize.getQueryInterface().addColumn('clients', 'zipCode', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });

};

export const down: Migration = async ({ context: sequelize }) => {

	await sequelize.getQueryInterface().addColumn('clients', 'address', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    });
	await sequelize.getQueryInterface().removeColumn('clients', 'document');
	await sequelize.getQueryInterface().removeColumn('clients', 'street');
	await sequelize.getQueryInterface().removeColumn('clients', 'number');
	await sequelize.getQueryInterface().removeColumn('clients', 'complement');
	await sequelize.getQueryInterface().removeColumn('clients', 'city');
	await sequelize.getQueryInterface().removeColumn('clients', 'state');
	await sequelize.getQueryInterface().removeColumn('clients', 'zipCode');
};
