import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../client';

//const prisma = new PrismaClient();


export const getPokemons = async (_req: Request, res: Response) => {
    // res.status(200).send('Liste des Pokemon');
    try {
        const poke = await prisma.pokemonCard.findMany();
        res.status(200).send(poke);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des cartes Pokémon:', error);
        res.status(500).send({ message: 'Une erreur est survenue lors de la récupération des cartes Pokémon' });
    }
}

export const getPokemonId = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params

    try {
        const new_poke = await prisma.pokemonCard.findUnique({
            where: { id: Number(pokemonCardId) },
            include: { type: true }
        })

        if (!new_poke) {
            res.status(404).send({ error: 'PokemonCard not found' });
            return
        }
        res.status(200).send(new_poke);
    } catch (error) {
        res.status(500).send({ error: 'PokemonCard not found' });
    }
}

export const postPokemonCreate = async (_req: Request, res: Response) => {
    try {
        const { name, pokedexld, type, lifePoint, weight, size, imageUrl } = _req.body
        const poke_create = await prisma.pokemonCard.create({
            data: {
                name,
                pokedexld,
                type: { connect: { id: type } },
                // type: { connect: { id: type }, connect: { id: type } },
                lifePoint,
                weight,
                size,
                imageUrl,
            },
        });
        if (!poke_create) {
            res.status(404).send({ message: 'PokemonCard not found' });
        }
        res.status(201).send(poke_create);
    } catch (error) {
        res.status(500).send({ error: "Il y a une erreur." });

    }
    // }
    // else {
    // res.writeHead(404, { 'Content-Type': 'text/plain' });
    // res.end("Le pokemon n'a pas été créé.");
    // }
}


export const deletePokemonId = async (_req: Request, res: Response) => {
    try {
        const { pokemonCardId } = _req.params
        const post = await prisma.pokemonCard.delete({
            where: { id: Number(pokemonCardId) },
        })
        res.status(201).send(post);
        // res.json(post)
    }
    catch (error) {
        res.status(404).send("Impossible de supprimer le pokemon.");
    }
}

export const updatePokemonId = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params
    const { name, pokedexld, type, lifePoint, weight, size, imageUrl } = _req.body
    try {
        const post = await prisma.pokemonCard.update({
            where: { id: Number(pokemonCardId) },
            data: {
                name,
                pokedexld,
                type: { connect: { id: type } },
                lifePoint,
                weight,
                size,
                imageUrl,
            },
        })
        // res.json(post)
        // res.status(200).json(post);
        if (!post) {
            res.status(404).send({ error: 'PokemonCard not found' });
            return
        }
        res.status(200).send(post);

    } catch (error) {
        res.status(500).send("Impossible de modifier le pokemon.");
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
