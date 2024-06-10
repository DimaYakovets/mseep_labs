import express from 'express';
import { handler } from '../handler';
import { Recipe, Resource, User, RecipeResource, } from '../dao/dbcontext';

export const modelController = express.Router();

const models = {
    users: {
        model: User,
        params: {
            create: async (model, dto) => {
                return await model.create(dto);
            },

            get: async (model) => {
                return await model.findAll();
            }
        }
    },
    resources: {
        model: Resource,
        params: {
            create: async (model, dto) => {
                return await model.create(dto);
            },

            get: async (model) => {
                return await model.findAll();
            }
        }
    },
    recipes: {
        model: Recipe,
        params: {
            create: async (model, dto) => {
                const recipe = await model.create(dto);
                const result = { id: recipe.id, name: recipe.name, ingredients: [] };

                for (const iterator of dto.ingredients.filter(i => i)) {
                    const ing = await RecipeResource.create({
                        recipe_id: recipe.id,
                        resource_id: iterator.id,
                        quantity: iterator.quantity,
                    });

                    result.ingredients.push(ing);
                }

                return result;
            },

            get: async (model) => {
                const items = (await model.findAll());


                const mapped = await Promise.all(items.map(async (i) => {
                    const ingredients = await RecipeResource.findAll({ where: { recipe_id: i.id } });
                    return { id: i.id, name: i.name, ingredients };
                }));

                console.log('items', mapped);

                return mapped;
            }
        }
    },
}

function get_model(name) {
    const result = models[name];

    return result;
}

modelController.get('/:name', handler(async (req, res) => {
    const { name } = req.params;
    const { model, params } = get_model(name);

    if (!model) {
        res.sendStatus(404);
        return;
    }

    return await params.get(model);
}));

modelController.get('/:name/:id', handler(async (req, res) => {
    const { name, id } = req.params;
    const { model, params } = get_model(name);

    if (!model) {
        res.sendStatus(404);
        return;
    }

    return await model.findOne({ where: { id } });
}));

modelController.post('/:name', handler(async (req, res) => {
    const { name } = req.params;
    const { model, params } = get_model(name);

    if (!model) {
        res.sendStatus(404);
        return;
    }

    console.log('body', req.body);

    const result = await params.create(model, req.body);

    console.log('result', result);

    return result;
}));

modelController.put('/:name/:id', handler(async (req, res) => {
    const { name, id } = req.params;
    const { model, params } = get_model(name);

    if (!model) {
        res.sendStatus(404);
        return;
    }

    return await model.update(req.body, { where: { id } });
}));

modelController.delete('/:name/:id', handler(async (req, res) => {
    const { name, id } = req.params;
    const { model, params } = get_model(name);

    if (!model) {
        res.sendStatus(404);
        return;
    }

    return await model.destroy({ where: { id } });
}));
