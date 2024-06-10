import { DataTypes } from 'sequelize';

/**
 * 
 * @param { import('sequelize').Sequelize } sequelize 
 * @returns { import('sequelize').Model }
 */
function initRecipeResource(sequelize) {
  const RecipeResource = sequelize.define('RecipeResource', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'recipe_resources',
    timestamps: false,
  });

  return RecipeResource;
}

export { initRecipeResource };
