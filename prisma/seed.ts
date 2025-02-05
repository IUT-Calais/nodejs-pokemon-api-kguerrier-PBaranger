import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';

const bcrypt = require("bcrypt")
const prisma = new PrismaClient();

async function main() {
  await prisma.type.deleteMany();
  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });


  await prisma.pokemonCard.create({
    data: {
      name: "Premier Poke",
      pokedexld: 2,
      type: { connect: { id: 6 } },
      // typeID : 6,
      lifePoint: 16,
    },
  });
  await prisma.pokemonCard.create({
    data: {

      "name": "Bulbizarre",
      "pokedexld": 1,
      "size": 0.7,
      "type": { connect: { id: 1 } }, // Référence à l'id de la table types
      "lifePoint": 45,
      "weight": 6.9,
      "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"

    },
  });

  await prisma.pokemonCard.create({
    data: {

      "name": "Carabaffe",
      "pokedexld": 8,
      "size": 1,
      "type": { connect: { id: 3 } }, // Référence à l'id de la table types
      "lifePoint": 143,
      "weight": 22.5,
      "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png"

    },
  });


  await prisma.pokemonCard.create({
    data: {

      "name": "Phyllali",
      "pokedexld": 470,
      "size": 1,
      "type": { connect: { id:  4} }, // Référence à l'id de la table types
      "lifePoint": 196,
      "weight": 25.5,
      "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/470.png"

    },
  });


  await prisma.pokemonCard.create({
    data: {

      "name": "Dialga",
      "pokedexld": 483,
      "size": 5.4,
      "type": { connect: { id: 15} }, // Référence à l'id de la table types
      "lifePoint": 220,
      "weight": 683,
      "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png"

    },
  });

  
  const hashedPassword = await bcrypt.hash("admin", 10);
  await prisma.user.create({
    data: {
      "email": "admin@gmail.com",
      "password": hashedPassword
    }
  })

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
