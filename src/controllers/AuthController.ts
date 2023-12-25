import { createUser, getUserByEmail, getUserById } from '../db/users';
import express from 'express';
import { WDAUTH_SESSION_API, authentication, random } from '../helpers';
import { get } from 'lodash';
// import { authentication, random } from '../helpers';

export const login = async (request: express.Request, response: express.Response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return response.sendStatus(400);
        }


        const expectedHash = authentication(user.authentication?.salt as string, password);
        if (user.authentication?.password !== expectedHash) {
            return response.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString())
        await user.save();

        response.cookie(WDAUTH_SESSION_API, user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return response.status(200).json(user);

    } catch (error) {
        return response.sendStatus(400);
    }
}

export const register = async (request: express.Request, response: express.Response) => {
    try {
        const { email, password, name } = request.body;

        if (!email || !password || !name) {
            return response.sendStatus(400);
        }

        const isUserExists = await getUserByEmail(email);
        if (isUserExists) {
            return response.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            name,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return response.status(201).json(user);

    } catch (error) {
        return response.sendStatus(400);
    }
}

export const logout = async (request: express.Request, response: express.Response) => {
    try {
        const getUserId = get(request, 'identity._id')! as string;

        if (!getUserId) {
            return response.sendStatus(403);
        }
        const user = await getUserById(getUserId);
        if (user) {
            user.authentication?.sessionToken = null;
            await user.save();
        }

        return response.status(200).json(user);


    } catch (error) {
        return response.sendStatus(400);
    }
}