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
          typeID: 1, // Référence à l'id de la table types
          lifePoint: 45,
          weight: 6.9,
          imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
        },
        {
          id: 2,
          name: "Carabaffe",
          pokedexld: 8,
          size: 1,
          typeID: 3, // Référence à l'id de la table types
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

    // it('shouldn\'t fetch one PokemonCards', async () => {
    //   const mockPokemonCards = {
    //     id: 56,
    //     name: "Bulbizarre",
    //     pokedexld: 1,
    //     size: 0.7,
    //     typeID: 1, // Référence à l'id de la table types
    //     lifePoint: 45,
    //     weight: 6.9,
    //     imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
    //   };
    //   prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

    //   const response = await request(app).get('/pokemon-cards');
    //   expect(response.status).toBe(404);
    //   expect(response.body).toEqual(mockPokemonCards);
    // });
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
      const response = await request(app).get('/pokemon-cards/5');
      expect(response.status).toBe(404);
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
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);
      const response = await request(app).post('/pokemon-cards/create');
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);
    });

    //   it('should return 404 if PokemonCard is not create', async () => {
    //     const createdPokemonCard = {
    //       id: 4,
    //       name: "Dialga",
    //       pokedexld: 483,
    //       size: 5.4,
    //       typeID: 15,
    //       lifePoint: 220,
    //       weight: 683,
    //       imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"
    //     };
    //     prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);
    //     const response = await request(app).post('/pokemon-cards/create');
    //     expect(response.status).toBe(404);
    //     expect(response.body).toEqual(createdPokemonCard);
    //   });

    it('should return 404 if the PokemonCard is not found', async () => {
      // prismaMock.pokemonCard.create.mockResolvedValue(null);
      prismaMock.pokemonCard.create.mockRejectedValue(new Error('404 Client Error: Not Found'));

      const response = await request(app).post('/pokemon-cards/create');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'PokemonCard not found' });
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

      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);
      const response = await request(app).patch('/pokemon-cards/update/4');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
    });

    it('should return 404 if PokemonCard is not update', async () => {
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

      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);
      const response = await request(app).patch('/pokemon-cards/update/6');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'PokemonCard not found' });
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
      const response = await request(app).delete('/pokemon-cards/delete/4');
      expect(response.status).toBe(201);
      expect(response.body).toEqual(deletedPokemonCard);
    });

  });

});
