import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


export const getUser = async (_req: Request, res: Response) => {
    try {
        const use = await prisma.user.findMany();
        res.status(200).send(use);
        return
    }
    catch (error) {
        res.status(500).send({ error: 'Une erreur est survenue lors de la récupération de l\'utilisateur' });
    }
}



export const postUserCreate = async (_req: Request, res: Response) => {
    try {

        const { email, password } = _req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        if (email == null || password == null) {
            res.status(400).send({ error: "Champs requis manquants." });
            return;
        }
        const user_unique_email = await prisma.user.findUnique({
            where: { email }
        })
        if (user_unique_email) {
            res.status(400).send({ error: "L'email existe déjà." });
            return
        }
        const user_create = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        if (!user_create) {
            res.status(404).send("Impossible de créer l'utilisateur.");
            return
        }
        res.status(201).send("Utilisateur créé");
        return
    } catch (error) {
        res.status(500).send({ error: "Il y a une erreur." });

    }
}


export const postUserLogin = async (_req: Request, res: Response) => {
    const { email, password } = _req.body

    try {
        const user_login_email = await prisma.user.findUnique({
            where: { email }
        })

        if (!user_login_email) {
            res.status(404).send({ error: "L'utilisateur n'existe pas." });
            return
        }

        const test_password = await bcrypt.compare(password, user_login_email.password);

        if (!test_password) {
            res.status(400).send({ error: "Le mot de passe ne correspond pas à l'utilisateur." });
            return;
        }

        const token = jwt.sign(
            { username: email },
            process.env.JWT_SECRET as jwt.Secret, // Secret
            // { expiresIn: process.env.JWT_EXPIRES_IN } // Expiration
            { expiresIn: "1d" }
        );

        res.status(201).send("Connexion réussie");
        return
    } catch (error) {
        res.status(500).send({ error: "Il y a une erreur." });
    }
}


export const deleteUserId = async (_req: Request, res: Response) => {
    try {
        const userId = parseInt(_req.params.userId);

        if (isNaN(userId)) {
            res.status(400).send({ error: "ID de l'utilisateur non valide." });
            return
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        res.status(200).send("Utilisateur supprimé");
        return
    }
    catch (error) {
        res.status(500).send("Error.");
    }
}

export const updateUserId = async (_req: Request, res: Response) => {
    const { userCardId } = _req.params

    try {
        const userId = parseInt(_req.params.userId);

        if (isNaN(userId)) {
            res.status(400).send({ error: "ID de l'utilisateur non valide." });
            return
        }

        const { email, password } = _req.body;

        if (!email || !password) {
            res.status(400).send({ error: "Il manque des informations." });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email, "password": hashedPassword },
        });

        res.status(200).send(updatedUser);
        return
    } catch (error) {
        res.status(500).send("Error.");
    }
}