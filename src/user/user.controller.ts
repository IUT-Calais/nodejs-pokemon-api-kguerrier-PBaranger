import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const bcrypt = require("bcrypt")

const prisma = new PrismaClient();


// export const getUser = async (_req: Request, res: Response) => {
//     // res.status(200).send('Liste des Pokemon');
//     const use = await prisma.user.findMany();
//     res.status(200).send(use);

// }

export const postUserCreate = async (_req: Request, res: Response) => {
    try {
        const { email, password } = _req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user_create = await prisma.user.create({
            data: {
                email,
                password : hashedPassword,

            },
        });
        if (!user_create) {
            res.status(404).send("Impossible de créer l'utilisateur.");
        }
        res.status(201).send(`${_req.body.email} vient d'être ajouté dans la base de donnée`);
    } catch (error) {
        res.status(500).json({ error: "Il y a une erreur." });

    }
    // }
    // else {
    // res.writeHead(404, { 'Content-Type': 'text/plain' });
    // res.end("Le pokemon n'a pas été créé.");
    // }
}


export const postUserLogin = async (_req: Request, res: Response) => {
    const { email, password } = _req.body
    const hashedPassword = await bcrypt.hash("password", 10);

    try {
        const user_login = await prisma.user.findUnique({
            where: { email,
                password : hashedPassword
            }
        })

        if (!user_login) {
            res.status(404).send("L'utilisateur avec n'existe pas.");
        }
        res.status(200).send(user_login);
    } catch (error) {
        res.status(500).json({ error: "Il y a une erreur." });
    }
}


// import http from 'http';

// // Création du serveur HTTP
// const server = http.createServer((req, res) => {
//   // Vérification de la méthode de la requête
//   if (req.method === 'GET') {
//     // Définition du code de statut de la réponse à 200 (OK)
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     // Envoi de la réponse
//     res.end('Requête GET réussie avec code 200\n');
//   } else {
//     // Si la méthode de la requête n'est pas GET, renvoyer un code 405 (Method Not Allowed)
//     res.writeHead(405, { 'Content-Type': 'text/plain' });
//     res.end('Méthode non autorisée\n');
//   }
// });
