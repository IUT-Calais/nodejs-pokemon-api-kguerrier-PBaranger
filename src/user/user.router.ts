import { Router } from 'express';
import { getUser, postUserCreate, postUserLogin, deleteUserId, updateUserId } from './user.controller';

export const userRouter = Router();
// Route pour obtenir la liste des utilisateurs
userRouter.get('/', getUser);
userRouter.post('/', postUserCreate)
userRouter.post('/login', postUserLogin)
userRouter.delete('/delete/:userId', deleteUserId)
userRouter.patch('/update/:userId', updateUserId)