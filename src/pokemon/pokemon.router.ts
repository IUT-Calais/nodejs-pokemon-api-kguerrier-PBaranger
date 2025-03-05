import { Router } from 'express';
import { getPokemons, getPokemonId, postPokemonCreate, deletePokemonId, updatePokemonId } from './pokemon.controller';

export const pokemonRouter = Router();
// Route pour obtenir la liste des pokemon
pokemonRouter.get('/', getPokemons);
pokemonRouter.get('/:pokemonCardId', getPokemonId);
pokemonRouter.post('/create', postPokemonCreate)
pokemonRouter.delete('/delete/:pokemonCardId', deletePokemonId)
pokemonRouter.patch('/update/:pokemonCardId', updatePokemonId)