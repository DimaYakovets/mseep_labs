import GLPK from 'glpk.js';


window.model = async function (XMin, XMax, YMin, YMax, VMin, VMax, WMin, WMax, resources, recipes) {
    try {
        console.log('x min', XMin);
        console.log('x max', XMax);
        console.log('y min', YMin);
        console.log('y max', YMax);
        console.log('v min', VMin);
        console.log('v max', VMax);
        console.log('w min', WMin);
        console.log('w max', WMax);
        console.log('resources', resources);
        console.log('recipes', recipes);

        const rawPricesOfProducts = recipes
            .map(({ ingredients }) =>
                ingredients.reduce((acc, count, index) =>
                    acc + count * resources[index].buy, 0
                )
            );


        const goods = rawPricesOfProducts.map((_, i) => ({
            name: recipes[i].name,
            raw: rawPricesOfProducts[i],
            sell: rawPricesOfProducts[i] * 5,
            gain: rawPricesOfProducts[i] * 5 - rawPricesOfProducts[i],
        }));


        const glpk = await GLPK();

        const problem = {
            name: 'LP',

            generals: [
                ...recipes.map((_, j) => `x${j + 1}`),
            ],

            objective: {
                direction: glpk.GLP_MAX,
                name: 'obj',
                vars: [
                    ...goods.map((good, j) => {
                        return {
                            name: 'x' + (j + 1),
                            coef: good.gain,
                        };
                    }),
                    ...resources.map((res, i) => {
                        return {
                            name: 'w' + (i + 1),
                            coef: res.sell,
                        };
                    }),
                    ...resources.map((res, i) => {
                        return {
                            name: 'y' + (i + 1),
                            coef: -res.buy,
                        };
                    }),
                    /*
                    ...resources.map((res, i) => {
                        return {
                            name: 'v' + (i + 1),
                            coef: -res.buy,
                        };
                    }),
                    */
                ]
            },

            subjectTo: [
                ...resources.map((_, i) => {
                    return {
                        name: 'sum ' + (i + 1),
                        vars: [
                            ...recipes.map((rec, j) => {
                                return {
                                    name: 'x' + (j + 1),
                                    coef: rec.ingredients[i],
                                };
                            }),
                            {
                                name: 'y' + (i + 1),
                                coef: -1,
                            }
                        ],
                        bnds: {
                            type: glpk.GLP_FX,
                            lb: 0,
                            ub: 0,
                        }
                    }
                }),
                ...resources.map((resource, i) => {
                    return {
                        name: 'y - v + w - b : ' + (i + 1),
                        vars: [
                            { name: 'y' + (i + 1), coef: 1 },
                            { name: 'v' + (i + 1), coef: -1 },
                            { name: 'w' + (i + 1), coef: 1 },
                        ],
                        bnds: {
                            type: glpk.GLP_FX,
                            lb: 0,
                            ub: 0,
                        }
                    };
                }),
                ...recipes.map((_, j) => {
                    return {
                        name: 'xBounds' + (j + 1),
                        vars: [
                            { name: 'x' + (j + 1), coef: 1 }
                        ],
                        bnds: {
                            type: glpk.GLP_DB,
                            lb: XMin[j], ub: XMax[j],
                        }
                    };
                }),
                ...resources.map((_, i) => {
                    return {
                        name: 'yBounds' + (i + 1),
                        vars: [
                            { name: 'y' + (i + 1), coef: 1 }
                        ],
                        bnds: {
                            type: glpk.GLP_DB,
                            lb: YMin[i], ub: YMax[i],
                        }
                    };
                }),
                ...resources.map((_, i) => {
                    return {
                        name: 'vBounds' + (i + 1),
                        vars: [
                            { name: 'v' + (i + 1), coef: 1 }
                        ],
                        bnds: {
                            type: glpk.GLP_DB,
                            lb: VMin[i], ub: VMax[i],
                        }
                    };
                }),
                ...resources.map((_, i) => {
                    return {
                        name: 'wBounds' + (i + 1),
                        vars: [
                            { name: 'w' + (i + 1), coef: 1 }
                        ],
                        bnds: {
                            type: glpk.GLP_DB,
                            lb: WMin[i], ub: WMax[i],
                        }
                    };
                }),
            ]
        };

        console.log(problem);

        const solutionStatus = {
            [glpk.GLP_UNDEF]: "solution is undefined",
            [glpk.GLP_FEAS]: "solution is feasible",
            [glpk.GLP_INFEAS]: "solution is infeasible",
            [glpk.GLP_NOFEAS]: "no feasible solution exists",
            [glpk.GLP_OPT]: "solution is optimal",
            [glpk.GLP_UNBND]: "solution is unbounded"
        };



        const solution = await glpk.solve(problem);
        solution.result.status = solutionStatus[solution.result.status];


        return solution;
    } catch (error) {
        console.log(error);
    }
}