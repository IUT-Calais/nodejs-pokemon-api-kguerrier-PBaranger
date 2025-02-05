import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getPokemons = async (_req: Request, res: Response) => {
    // res.status(200).send('Liste des Pokemon');
    const poke = await prisma.pokemonCard.findMany({ include: { type: true } });
    res.status(200).send(poke);

}

export const getPokemonId = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params
    const post = await prisma.pokemonCard.findUnique({
        where: { id: Number(pokemonCardId) },
        include: { type: true }
    })
    res.json(post)
}

export const postPokemonCreate = async (_req: Request, res: Response) => {
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
    res.status(200).send(poke_create);
}


export const deletePokemonId = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params
    const post = await prisma.pokemonCard.delete({
        where: { id: Number(pokemonCardId) },
    })
    res.json(post)
}

export const updatePokemonId = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params
    const { name, pokedexld, type, lifePoint, weight, size, imageUrl } = _req.body

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
    res.json(post)
}