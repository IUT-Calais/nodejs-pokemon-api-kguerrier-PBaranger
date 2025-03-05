import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


// export const getUser = async (_req: Request, res: Response) => {
//     // res.status(200).send('Liste des utilisateur');
//     const use = await prisma.user.findMany();
//     res.status(200).send(use);
// }

export const postUserCreate = async (_req: Request, res: Response) => {
    try {
        const { email, password } = _req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user_unique_email = await prisma.user.findUnique({
            where: { email }
        })
        if (user_unique_email) {
            res.status(400).send("L'email existe déjà.");
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
        }
        res.status(201).send(`${_req.body.email} vient d'être ajouté dans la base de donnée`);
    } catch (error) {
        res.status(500).json({ error: "Il y a une erreur." });

    }
}


export const postUserLogin = async (_req: Request, res: Response) => {
    const { email, password } = _req.body

    try {
        const user_login_email = await prisma.user.findUnique({
            where: { email }
        })

        if (!user_login_email) {
            res.status(404).send("L'utilisateur n'existe pas.");
            return
        }

        const test_password = await bcrypt.compare(password, user_login_email.password);
        if (test_password == true) {
            res.status(201).send("La connexion à réussi");
        }
        else {
            res.status(400).send("Le mot de passe ne correspond pas à l'utilisateur.");
        }

        const token = jwt.sign(
            { username: email }, // Payload
            process.env.JWT_SECRET as jwt.Secret, // Secret
            { expiresIn: process.env.JWT_EXPIRES_IN } // Expiration
            // {expiresIn:1d}
        );
        res.status(200).json({
            myToken: token,
        })

        // res.status(200).send(user_login);
    } catch (error) {
        res.status(500).json({ error: "Il y a une erreur." });
    }
}