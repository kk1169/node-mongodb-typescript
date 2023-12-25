import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';

const router = express.Router();
export default (): express.Router => {

    authRoute(router);
    userRoute(router);

    return router;
}