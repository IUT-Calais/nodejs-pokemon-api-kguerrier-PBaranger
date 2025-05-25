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

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

app.use('/pokemon-cards', pokemonRouter);
app.use('/users', userRouter);

// On charge la spécification Swagger
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
// Et on affecte le Serveur Swagger UI à l'adresse /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));