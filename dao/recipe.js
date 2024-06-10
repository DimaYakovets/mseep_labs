import { DataTypes } from 'sequelize';

/**
 * 
 * @param { import('sequelize').Sequelize } sequelize 
 * @returns { import('sequelize').Model }
 */
function initRecipe(sequelize) {
    return sequelize.define('Recipe', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'recipes',
        timestamps: false,
    });
}

export { initRecipe };
