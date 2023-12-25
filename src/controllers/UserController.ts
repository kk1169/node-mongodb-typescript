import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';
import { get } from 'lodash';
import { authentication, random } from '../helpers';

export const getAllUsers = async (request: express.Request, response: express.Response) => {
    try {
        const users = await getUsers();
        return response.status(200).json(users);
    } catch (error) {
        return response.sendStatus(400);
    }
}

export const updateUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
        const { name } = request.body;
        const getUserId = get(request, 'identity._id')! as string;

        if (!getUserId) {
            return response.sendStatus(403);
        }
        const user = await getUserById(getUserId);
        if (user) {
            user.name = name;
            await user.save();
            return response.status(200).json(user);
        }
        return response.sendStatus(403);
    } catch (error) {
        return response.sendStatus(400);
    }
}

export const changePassword = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
        const { password } = request.body;
        const getUserId = get(request, 'identity._id')! as string;

        if (!getUserId) {
            return response.sendStatus(403);
        }
        const user = await getUserById(getUserId);
        const salt = random();
        if (user) {
            user.authentication = {
                salt,
                password: authentication(salt, password)
            };
            await user.save();
            return response.status(200).json({ message: 'Password Updated.' });
        }
        return response.sendStatus(403);
    } catch (error) {
        return response.sendStatus(400);
    }
}

export const getLoggedUser = async (request: express.Request, response: express.Response) => {
    try {
        const getUserId = get(request, 'identity._id')! as string;

        if (!getUserId) {
            return response.sendStatus(403);
        }
        const user = await getUserById(getUserId);
        return response.status(200).json(user);
    } catch (error) {
        return response.sendStatus(400);
    }
}

export const deleteUser = async (request: express.Request, response: express.Response) => {
    try {
        const { id } = request.params;
        const deleteUser = await deleteUserById(id);
        return response.status(200).json(deleteUser);
    } catch (error) {
        return response.sendStatus(400)
    }
}