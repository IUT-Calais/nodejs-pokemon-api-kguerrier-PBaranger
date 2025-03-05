import { Router } from 'express';
// import { getUser, postUserCreate } from './user.controller';
import { postUserCreate, postUserLogin } from './user.controller';

export const userRouter = Router();
// Route pour obtenir la liste des utilisateurs
// userRouter.get('/view', getUser);
userRouter.post('/', postUserCreate)
userRouter.post('/login', postUserLogin)