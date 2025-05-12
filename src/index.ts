import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { pokemonRouter } from './pokemon/pokemon.router'
import { userRouter } from './user/user.router'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

export const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

// import {userRoute}
// app.use('/user', userRoute)

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// app.get('/pokemons-cards', (_req: Request, res: Response) => {
//   res.status(200).send(`Liste des pokemon`);
// });

// app.get('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
// res.status(200).send(`Pokemon ${_req.params.pokemonCardId}`);
// });

app.use('/pokemon-cards', pokemonRouter);
app.use('/users', userRouter);

// On charge la spécification Swagger
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
// Et on affecte le Serveur Swagger UI à l'adresse /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.get('/pokemons-cards/', async (_req, res) => {
//   const poke = await prisma.pokemonCard.findMany({ include: { type: true } });
//   res.status(200).send(poke);
// });


// app.get('/pokemon-cards/:pokemonCardId', async (_req, res) => {
//   const { pokemonCardId } = _req.params
//   const post = await prisma.pokemonCard.findUnique({
//     where: { id: Number(pokemonCardId) },
//   })
//   res.json(post)
// });


// app.post('/pokemon-cards/create', async (_req, res) => {
//   const { name, pokedexld, type, lifePoint, weight, size, imageUrl } = _req.body
//   const poke_create = await prisma.pokemonCard.create({
//     data: {
//       name,
//       pokedexld,
//       type: { connect: { id: type } },
//       lifePoint,
//       weight,
//       size,
//       imageUrl,
//     },
//   });
//   res.status(200).send(poke_create);
// });


// app.delete(`/pokemon-cards/delete/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.pokemonCard.delete({
//     where: { id: Number(id) },
//   })
//   res.json(post)
// })

// app.patch(`/pokemon-cards/update/:id`, async (_req, res) => {
//   const { id } = _req.params
//   const updateUser = await prisma.pokemonCard.update({
//     where: { id: Number(id) },
//     data: { name: 'oiuyt', },
//   })
//   res.json(updateUser)
// })

// app.patch(`/pokemon-cards/update/:id1`, async (_req, res) => {
// const { pokemonCardId } = _req.params
// const { name, pokedexld, type, lifePoint, weight, size, imageUrl } = _req.body

// const post = await prisma.pokemonCard.update({
//     where: { id: Number(pokemonCardId) },
//     data: {
//         name,
//         pokedexld,
//         type: { connect: { id: type } },
//         lifePoint,
//         weight,
//         size,
//         imageUrl,
//     },
// })
// res.json(post)

// })
