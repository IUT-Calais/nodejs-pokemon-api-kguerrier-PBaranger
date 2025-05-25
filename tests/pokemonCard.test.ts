//MOI
import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';
afterAll(() => {
  stopServer();
});
describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          id: 1,
          name: "Bulbizarre",
          pokedexld: 1,
          size: 0.7,
          typeID: 1,
          lifePoint: 45,
          weight: 6.9,
          imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
        },
        {
          id: 2,
          name: "Carabaffe",
          pokedexld: 8,
          size: 1,
          typeID: 3,
          lifePoint: 143,
          weight: 22.5,
          imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png"
        },
        {
          id: 3,
          name: "Phyllali",
          pokedexld: 470,
          size: 1,
          typeID: 4,
          lifePoint: 196,
          weight: 25.5,
          imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/470.png"
        },
        {
          id: 4,
          name: "Dialga",
          pokedexld: 483,
          size: 5.4,
          typeID: 15,
          lifePoint: 220,
          weight: 683,
          imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
        },
      ];
      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemon-cards');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });

    it('should return 500 if an error occurs during fetching all', async () => {
      prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('Erreur'));
      const response = await request(app).get('/pokemon-cards');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Une erreur est survenue lors de la récupération des Pokémon" });
    });
  });


  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {
        id: 4,
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        typeID: 15,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);
      const response = await request(app).get('/pokemon-cards/4');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      const response = await request(app).get('/pokemon-cards/125');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'PokemonCard not found' });
    });

    it('should return 500 if an error occurs during fetching by ID', async () => {
      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Error'));
      const response = await request(app).get('/pokemon-cards/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'PokemonCard not found' });
    });
  });

  describe('POST /pokemon-cards/create', () => {
    it('should create a new PokemonCard', async () => {
      const createdPokemonCard = {
        id: 4,
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        typeID: 15,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };
      const sendPokemonCard = {
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        typeID: 15,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);
      const response = await request(app).post('/pokemon-cards/create').send(sendPokemonCard);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);
    });

    it('should return 400 if missing', async () => {
      const sendPokemonCard = {
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };
      const response = await request(app).post('/pokemon-cards/create').send(sendPokemonCard);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Il manque des champs' });
    });

    it('should return 404 if the PokemonCard is not created', async () => {
      const sendedPokemonCard = {
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };

      const response = (await request(app).post('/pokemon-cards/create').send(sendedPokemonCard));
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'PokemonCard non créé' });
    });

    it('should return 500 if an error occurs during creation', async () => {
      const newPokemon = {
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        typeID: 15,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };

      prismaMock.pokemonCard.create.mockRejectedValue(new Error('Error'));

      const response = await request(app).post('/pokemon-cards/create').send(newPokemon);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Il y a une erreur." });
    });

  });



  describe('PATCH /pokemon-cards/update/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const updatedPokemonCard = {
        id: 4,
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        typeID: 15,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };
      const updatedPokemon = {
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        typeID: 15,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };

      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);
      const response = (await request(app).patch('/pokemon-cards/update/4').send(updatedPokemon).set('Authorization', 'Bearer mockedToken'));
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
    });


    it('should return 404 if the PokemonCard is not found for update', async () => {
      const sendedPokemonCard = {
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };

      const response = (await request(app).patch('/pokemon-cards/update/4').send(sendedPokemonCard).set('Authorization', 'Token mockedToken'));
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'PokemonCard not found' });
    });

    it('should return 400 if missing required fields', async () => {
      const response = await request(app).patch('/pokemon-cards/update/4').set('Authorization', 'Bearer mockedToken').send({ name: null });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Il manque des champs' });
    });

    it('should return 500 if an error occurs during update', async () => {
      const updatedPokemon = {
        name: "Dialga",
        pokedexld: 483,
        typeID: 15,
        lifePoint: 230,
        weight: 683,
        size: 5.5,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };

      prismaMock.pokemonCard.update.mockRejectedValue(new Error('Error'));

      const response = await request(app).patch('/pokemon-cards/update/4').set('Authorization', 'Bearer mockedToken').send(updatedPokemon);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error" });
    });
  });



  describe('DELETE /pokemon-cards/delete/:pokemonCardId', () => {
    it('should delete a PokemonCard', async () => {
      const deletedPokemonCard = {
        id: 4,
        name: "Dialga",
        pokedexld: 483,
        size: 5.4,
        typeID: 15,
        lifePoint: 220,
        weight: 683,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
      };

      prismaMock.pokemonCard.delete.mockResolvedValue(deletedPokemonCard);
      const response = await request(app).delete('/pokemon-cards/delete/4').set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(201);
      expect(response.body).toEqual(deletedPokemonCard);
    });
    it('should return 404 if the PokemonCard is not found for deletion', async () => {
      prismaMock.pokemonCard.delete.mockRejectedValue(new Error('PokemonCard not found'));
      const response = await request(app).delete('/pokemon-cards/delete/4').set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Error' });
    });
  });

});
