
import express from 'express';
import { login, logout, register } from '../controllers/AuthController';
import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post('/auth/logout', isAuthenticated, logout);
}