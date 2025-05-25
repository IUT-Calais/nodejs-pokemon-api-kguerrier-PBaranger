import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../client';

//const prisma = new PrismaClient();


export const getPokemons = async (_req: Request, res: Response) => {
    try {
        const poke = await prisma.pokemonCard.findMany();
        res.status(200).send(poke);
        return
    }
    catch (error) {
        res.status(500).send({ error: 'Une erreur est survenue lors de la récupération des Pokémon' });
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
        return
    } catch (error) {
        res.status(500).send({ error: 'PokemonCard not found' });
    }
}

export const postPokemonCreate = async (_req: Request, res: Response) => {
    try {
        const { name, pokedexld, type, lifePoint, weight, size, imageUrl } = _req.body

        if (name == null || pokedexld == null || lifePoint == null) {
            res.status(400).send({ message: 'Il manque des champs' });
            return
        }

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
            res.status(404).send({ message: 'PokemonCard non créé' });
            return
        }
        res.status(201).send(poke_create);
        return
    } catch (error) {
        res.status(500).send({ error: "Il y a une erreur." });

    }
}


export const deletePokemonId = async (_req: Request, res: Response) => {
    try {
        const { pokemonCardId } = _req.params
        const post = await prisma.pokemonCard.delete({
            where: { id: Number(pokemonCardId) },
        })
        res.status(201).send(post);
        return
    }
    catch (error) {
        res.status(404).send({ error: 'Error' });
        return
    }
}

export const updatePokemonId = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params
    const { name, pokedexld, type, lifePoint, weight, size, imageUrl } = _req.body
    try {
        if (name == null || pokedexld == null || lifePoint == null) {
            res.status(400).send({ message: 'Il manque des champs' });
            return
        }

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
        if (!post) {
            res.status(404).send({ error: 'PokemonCard not found' });
            return
        }
        res.status(200).send(post);
        return

    } catch (error) {
        res.status(500).send({ error: 'Error' });
    }
}