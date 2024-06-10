import { Sequelize } from 'sequelize';
import { initResource } from './resource.js';
import { initRecipe } from './recipe.js';
import { initRecipeResource } from './recipe_resource.js';
import { initUser } from './user.js';

// Initialize Sequelize with your database configuration
const sequelize = new Sequelize('mseep', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres', // Change this to your database dialect
    logging: false,
});

const Resource = initResource(sequelize);
const Recipe = initRecipe(sequelize);
const RecipeResource = initRecipeResource(sequelize);
const User = initUser(sequelize);

const initDb = async () => {
    await sequelize.sync({ alter: true });
};

export { 
    sequelize,
    
    User, 
    Resource, 
    Recipe, 
    RecipeResource,

    initDb 
};
