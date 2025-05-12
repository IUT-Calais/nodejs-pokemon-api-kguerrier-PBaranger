import { Router } from 'express';
import { getPokemons, getPokemonId, postPokemonCreate, deletePokemonId, updatePokemonId } from './pokemon.controller';
import { verify } from 'crypto';
import { verifyJWT } from '../common/jwt.middleware';

export const pokemonRouter = Router();

pokemonRouter.get('/', getPokemons);
pokemonRouter.get('/:pokemonCardId', getPokemonId);
pokemonRouter.post('/create', postPokemonCreate)
pokemonRouter.delete('/delete/:pokemonCardId', deletePokemonId)
pokemonRouter.patch('/update/:pokemonCardId', updatePokemonId)

// pokemonRouter.get('/', verifyJWT, getPokemons)
// pokemonRouter.delete('/delete/:pokemonCardId', verifyJWT, deletePokemonId)
// pokemonRouter.patch('/update/:pokemonCardId', verifyJWT, updatePokemonId)
// pokemonRouter.delete('/:pokemonCardId', verifyJWT, deletePokemonId) ??
// pokemonRouter.patch('/:pokemonCardId', verifyJWT, updatePokemonId) ??