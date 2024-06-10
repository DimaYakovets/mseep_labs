import { User } from '../dao/dbcontext.js';

class UserService { 
    constructor() {
    }

    async addUser(user) {
        return await User.create(user)
    }

    async getUsers() {
        return await User.findAll();
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async login(username, password) {
        return await User.findOne({
            where: {
                username,
                password,
            }
        });
    }
}

export const userService = new UserService();
