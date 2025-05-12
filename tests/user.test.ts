import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

const bcrypt = require("bcrypt")

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const createdUser = {
        "id": 2,
        "email": "test10creation@mail.com",
        "password": hashedPassword
      };

      prismaMock.user.findUnique.mockResolvedValue(createdUser);
      prismaMock.user.create.mockResolvedValue(createdUser);

      const response = await request(app).post('/users');
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
    });
  });

  // describe('POST /users/login', () => {
  //   it('should login a user and return a token', async () => {
  //     const hashedPassword = await bcrypt.hash("admin", 10);
  //     const userTest = {
  //       "id": 2,
  //       "email": "test10creation@mail.com",
  //       "password": hashedPassword
  //     };
  //     const token = 'mockedToken';

  //     prismaMock.user.findUnique.mockResolvedValue(userTest);
  //     const response = await request(app).get('/users/login');
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       token,
  //       message: 'Connexion réussie',
  //     });
  //   });
  // });
});
