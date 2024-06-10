window.addEventListener('DOMContentLoaded', async () => {
    const request = async (method, url, body) => {
        try {
            const result = await fetch(url, {
                method: method,
                headers: {
                    ['Content-Type']: 'application/json',
                },
                body: body !== undefined ? JSON.stringify(body) : undefined,
            });

            if (result.status === 401) {
                window.location.href = '/login';
                return;
            } else if (result.status === 403) {
                window.location.href = '/forbidden.html';
                return;
            }

            return result;

        } catch (error) {
            return {};
        }
    }

    async function server(action, key, value, context, e) {
        switch (action) {
            case 'set':
                await request('POST', '/api/model/' + key, value);

                e.target.reset();
                break;

            case 'get':
                const result = await request('GET', '/api/model/' + key);

                return await result.json();
            case 'update':
                await request('PUT', `/api/model/${key}/${value.id}`, value);

                break;

            case 'delete':
                await request('DELETE', `/api/model/${key}/${value}`);
                break;

            case 'constructor':
                if (true) {
                    return;
                    const res = [
                        {
                            "name": "Філе куряче",
                            "buy": "108",
                            "sell": "118.8",
                            "y_min": "0",
                            "y_max": "1000",
                            "v_min": "0",
                            "v_max": "300",
                            "w_min": "0",
                            "w_max": "300",
                            "balance": "1000"
                        },
                        {
                            "name": "Вирізка свинна",
                            "buy": "220",
                            "sell": "242",
                            "y_min": "0",
                            "y_max": "1000",
                            "v_min": "0",
                            "v_max": "400",
                            "w_min": "0",
                            "w_max": "400",
                            "balance": "1000"
                        },
                        {
                            "name": "Вирізка теляча",
                            "buy": "250",
                            "sell": "275",
                            "y_min": "0",
                            "y_max": "1000",
                            "v_min": "0",
                            "v_max": "300",
                            "w_min": "0",
                            "w_max": "300",
                            "balance": "1000"
                        },
                        {
                            "name": "Сіль",
                            "buy": "13",
                            "sell": "14.3",
                            "y_min": "0",
                            "y_max": "100",
                            "v_min": "0",
                            "v_max": "300",
                            "w_min": "0",
                            "w_max": "500",
                            "balance": "100"
                        },
                        {
                            "name": "Перець",
                            "buy": "200",
                            "sell": "220",
                            "y_min": "0",
                            "y_max": "100",
                            "v_min": "0",
                            "v_max": "400",
                            "w_min": "0",
                            "w_max": "300",
                            "balance": "100"
                        },
                        {
                            "name": "Банка консервна",
                            "buy": "10",
                            "sell": "11",
                            "y_min": "0",
                            "y_max": "5000",
                            "v_min": "0",
                            "v_max": "2000",
                            "w_min": "0",
                            "w_max": "2000",
                            "balance": "5000"
                        }
                    ]



                    for (const item of res) {
                        /*await fetch(`/api/model/resources`, {
                            method: 'POST',
                            headers: {
                                ['Content-Type']: 'application/json',
                            },
                            body: JSON.stringify(item),
                        });
                        */
                    }

                    const ress = await server('get', 'resources');

                    const recs = [
                        {
                            "name": "Куряча консерва",

                            ingredients: {
                                "Філе куряче": "10",
                                "Сіль": "0.3",
                                "Перець": "0.02",
                                "Банка консервна": "25"
                            }
                        },
                        {
                            "name": "Свинна консерва",
                            ingredients: {
                                "Вирізка свинна": "18",
                                "Сіль": "0.4",
                                "Перець": "0.07",
                                "Банка консервна": "25"
                            }
                        },
                        {
                            "name": "Теляча консерва",
                            ingredients: {
                                "Вирізка теляча": "15",
                                "Сіль": "0.6",
                                "Перець": "0.07",
                                "Банка консервна": "25"
                            }
                        }
                    ];

                    const dtos = recs.map(r => {
                        return {
                            name: r.name,
                            ingredients: Object.entries(r.ingredients).map(entry => {
                                return {
                                    id: ress.find(i => i.name === entry[0]).id,
                                    quantity: Number(entry[1]),
                                }
                            })
                        }
                    })

                    for (const item of dtos) {
                        await fetch(`/api/model/recipes`, {
                            method: 'POST',
                            headers: {
                                ['Content-Type']: 'application/json',
                            },
                            body: JSON.stringify(item),
                        });
                    }

                    debugger;
                }
                break;
        }
    }

    // await server('constructor', 'resources');

    const userinfo = await (await fetch('/userinfo')).json();

    const nav = document.getElementById('header-list-panel');
    const user = document.getElementById('header-user-name');

    if (nav) {
        userinfo.routes.forEach(route => {
            const a = document.createElement('a');
            a.href = route.href;
            a.innerText = route.label;

            nav.appendChild(a);
        });

    }

    if (user) {
        user.innerText = userinfo.user;
    }

    const logoutBtn = document.getElementById('log-out-btn');

    logoutBtn?.addEventListener('click', () => {
        window.location.href = '/logout';
    });


    const createResourceForm = document.querySelector('form#create_resource');

    createResourceForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        formDataObject['balance'] = 0;


        await server('set', 'resources', formDataObject, 'Ресурс', e);
    });

    const balanceTable = document.getElementById('balance_table');

    if (balanceTable) {
        const list = await server('get', 'resources');
        if (list?.length) {
            list.forEach(item => {
                const parentBlock = document.createElement('div');
                parentBlock.classList.add('balance-item');
                parentBlock.innerHTML = `
                    <div class="balance-item-text">${item.name}</div>
                    <input name="${item.id}_buy" data-namekey="${item.id}" class="__input balance-input" placeholder="Купівля" value="${item.buy}"
                           type="text" pattern="[0-9]+([.,][0-9]+)?"/>
                   <input name="${item.id}_sell" data-namekey="${item.id}" class="__input balance-input" placeholder="Продаж" value="${item.sell}"
                       type="text" pattern="[0-9]+([.,][0-9]+)?"/>
                           
                    <input name="${item.id}_balance" data-namekey="${item.id}" class="__input balance-input" placeholder="Залишок" value="${item.balance}"
                           type="number"/>
                    <input name="${item.id}_y_min" data-namekey="${item.id}" class="__input balance-input" placeholder="Y min" value="${item.y_min}"
                           type="number"/>
                    <input name="${item.id}_y_max" data-namekey="${item.id}" class="__input balance-input" placeholder="Y max" value="${item.y_max}"
                           type="number"/>
                    <input name="${item.id}_v_min" data-namekey="${item.id}" class="__input balance-input" placeholder="V min" value="${item.v_min}"
                           type="number"/>
                    <input name="${item.id}_v_max" data-namekey="${item.id}" class="__input balance-input" placeholder="V max" value="${item.v_max}"
                           type="number"/>
                    <input name="${item.id}_w_min" data-namekey="${item.id}" class="__input balance-input" placeholder="W min" value="${item.w_min}"
                           type="number"/>
                    <input name="${item.id}_w_max" data-namekey="${item.id}" class="__input balance-input" placeholder="W max" value="${item.w_max}"
                           type="number"/>
                   <div class="delete-button" data-id="${item.id}"  data-name="${item.name}" data-context="resource">Видалити</div>
                    `;

                balanceTable.appendChild(parentBlock);

            });
        } else {
            balanceTable.innerHTML = `<div class="__placeholder">Немає створених ресурсів</div>`
        }
    }

    const balanceForm = document.querySelector('form#balance');

    balanceForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log(formDataObject)

        const dtos = Object.entries([...e.target.getElementsByTagName('input')]
            .reduce((acc, item) => {
                const key = item.dataset.namekey;

                if (!acc[key]) acc[key] = [];

                acc[key].push(item);

                return acc;
            }, {}))
            .map((entry) => {
                const [key, arr] = entry;

                const props = arr.reduce((acc, i) => {
                    acc[i.name.replace(key + '_', '')] = Number(i.value)

                    return acc;
                }, {});

                props.id = Number(key);

                return props;
            });

        console.log(dtos);

        for (const dto of dtos) {
            await server('update', 'resources', dto);
        }
    });

    const resourcesTable = document.getElementById('resources_table');

    if (resourcesTable) {
        const list = await server('get', 'resources');
        if (list?.length) {
            list.forEach(item => {
                const parentBlock = document.createElement('div');
                parentBlock.classList.add('resource-item');
                parentBlock.innerHTML = `
                    <input type="checkbox" class="__checkbox resource-checkbox">
                    <div class="resource-item-text">${item.name}</div>
                    <input disabled name="${item.id}" class="__input resource-input" placeholder="Витрати на 1 продукт" 
                           type="text" pattern="[0-9]+([.,][0-9]+)?"/>
                    `;

                resourcesTable.appendChild(parentBlock);

            });
        } else {
            resourcesTable.innerHTML = `<div class="__placeholder">Немає створених ресурсів</div>`
        }
    }

    document.querySelectorAll('.resource-checkbox').forEach(el => {
        el.addEventListener('change', (e) => {
            const node = el.parentNode.querySelector('.__input');
            if (el.checked) {
                node.setAttribute('required', 'required');
                node.removeAttribute('disabled');
            } else {
                node.removeAttribute('required');
                node.setAttribute('disabled', 'disabled');
                node.value = "";
                node.setAttribute('value', '');
            }
        });
    })

    const productForm = document.querySelector('form#create_product');

    productForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const dto = { name: '', ingredients: [] };
        formData.forEach((value, key) => {
            dto[key] = Number(value);
        });

        dto.name = formData.get('name');
        dto.ingredients = [];

        for (const key in dto) {
            if (key !== 'name' && key !== 'ingredients') {
                dto.ingredients[key] = { id: Number(key), quantity: dto[key] };
            }
        }

        await server('set', 'recipes', dto, 'Продукт', e);
    });


    const productionTable = document.getElementById('production_table');

    if (productionTable) {
        const list = await server('get', 'recipes');
        if (list?.length) {
            list.forEach(item => {
                const parentBlock = document.createElement('div');
                parentBlock.classList.add('resource-item');
                parentBlock.innerHTML = `
                    <input type="checkbox" data-id=${item.id} data-prop="selected" class="__checkbox product-checkbox" name="${item.name}">
                    <div class="resource-item-text">${item.name}</div>
                    <input disabled data-id=${item.id} data-prop="x_min" name="${item.name}_x_min" class="__input product-input" placeholder="X min" 
                           type="text" pattern="[0-9]+([.,][0-9]+)?"/>
                    <input disabled data-id=${item.id} data-prop="x_max" name="${item.name}_x_max" class="__input product-input" placeholder="X max" 
                           type="text" pattern="[0-9]+([.,][0-9]+)?"/>
                           
                    <div class="delete-button" data-id="${item.id}" data-name="${item.name}" data-context="product">Видалити</div>
                  
                    `;

                productionTable.appendChild(parentBlock);

            });
        } else {
            productionTable.innerHTML = `<div class="__placeholder">Немає створених продуктів</div>`
        }
    }

    document.querySelectorAll('.product-checkbox').forEach(el => {
        el.addEventListener('change', (e) => {
            const __node = el.parentNode.querySelectorAll('.__input');
            if (el.checked) {
                __node.forEach(node => {
                    node.setAttribute('required', 'required');
                    node.removeAttribute('disabled');
                })
            } else {
                __node.forEach(node => {
                    node.removeAttribute('required');
                    node.setAttribute('disabled', 'disabled');
                    node.value = "";
                    node.setAttribute('value', '');
                })
            }
        });
    })

    const productionForm = document.querySelector('form#production');
    const resultsTable = document.getElementById('results_table');

    productionForm?.addEventListener('submit', async (e) => {
        resultsTable.innerHTML = ``;
        e.preventDefault();
        const formData = new FormData(e.target);

        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        const prods = Object.entries([...e.target.getElementsByTagName('input')]
            .reduce((acc, item) => {
                const key = item.dataset.id;

                if (!acc[key]) acc[key] = [];

                acc[key].push(item);

                return acc;
            }, {}))
            .map((entry) => {
                const [key, arr] = entry;

                const props = arr.reduce((acc, i) => {
                    acc[i.dataset.prop] = i.type === 'text' ? Number(i.value) : i.checked;

                    return acc;
                }, {});

                props.id = Number(key);

                return props;
            }).filter(item => item.selected);

        console.log(prods);

        const __resources = await server('get', 'resources');
        const __products = await server('get', 'recipes');

        const YMin = __resources.map(el => parseFloat(el.y_min));
        const YMax = __resources.map(el => parseFloat(el.y_max));
        const VMin = __resources.map(el => parseFloat(el.v_min));
        const VMax = __resources.map(el => parseFloat(el.v_max));
        const WMin = __resources.map(el => parseFloat(el.w_min));
        const WMax = __resources.map(el => parseFloat(el.w_max));
        let XMin = [];
        let XMax = [];


        const resources = __resources;

        const defRecipe = (name, ings) => {
            const result = {
                name,
                ingredients: resources.map(m => 0),
            };

            for (const ing of ings) {
                const index = resources.findIndex(res => res.id === ing.resource_id);

                if (index !== -1) {
                    result.ingredients[index] = ing.quantity;
                }
            }

            return result;
        }

        const recipes = prods.map(item => {
            const recipe = __products.find(el => el.id === item.id);

            XMin.push(item.x_min);
            XMax.push(item.x_max);

            return defRecipe(recipe.name, recipe.ingredients);
        });

        let rslt;

        window.model(XMin, XMax, YMin, YMax, VMin, VMax, WMin, WMax, resources, recipes).then(solution => {
            if (resultsTable) {
                //resultsTable.innerHTML += `<h1>Статус: ${solution.result.status}</h1>`;
                resultsTable.innerHTML += `<h2>Прибуток: ${Math.round(solution.result.z, 2)}</h2>`;

                let i = 1;

                for (const recipe of recipes) {
                    resultsTable.innerHTML += `<h2>${recipe.name}: ${solution.result.vars['x' + i++]}</h2>`;
                }

            }
        });
    });


    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async () => {
            if (confirm('Підтвердіть видалення')) {
                debugger;
                if (button.dataset.context === 'resource') {

                    server('delete', 'resources', button.dataset.id, 'Ресурс');

                    button.parentNode.remove();
                } else if (button.dataset.context === 'product') {

                    server('delete', 'recipes', button.dataset.id, 'Продукт');

                    button.parentNode.remove();
                }
            }
        })
    });
});