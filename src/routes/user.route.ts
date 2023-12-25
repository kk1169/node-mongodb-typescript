
import express from 'express';
import { changePassword, getAllUsers, getLoggedUser, updateUser } from '../controllers/UserController';
import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.put('/update-user', isAuthenticated, updateUser);
    router.put('/change-password', isAuthenticated, changePassword);
    router.get('/logged-user', isAuthenticated, getLoggedUser);
}