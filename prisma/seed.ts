import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';

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

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
