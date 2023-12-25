import express from 'express';
import { get, identity, merge } from 'lodash'
import { WDAUTH_SESSION_API } from '../helpers';
import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = request.cookies[WDAUTH_SESSION_API];

        if (!sessionToken) {
            return response.sendStatus(403);
        }

        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            return response.sendStatus(403);
        }

        merge(request, { identity: user });
        return next();
    } catch (error) {
        return response.sendStatus(400);
    }
}