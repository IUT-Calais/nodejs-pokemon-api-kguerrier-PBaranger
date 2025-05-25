import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

describe('User  API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'admin@example.com',
        password: 'password'
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      prismaMock.user.create.mockResolvedValue({
        id: 1,
        email: newUser.email,
        password: 'hashedPassword',
      });

      const response = await request(app).post('/users').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual("Utilisateur créé");
    });

    it('should return 400 if fields are missing', async () => {
      const response = await request(app).post('/users').send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Champs requis manquants." });
    });

    it('should return 400 if user already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'admin@example.com', password: 'hashedPassword' });

      const response = await request(app).post('/users').send({
        email: 'admin@example.com',
        password: 'password'
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "L'email existe déjà." });
    });

    it('should return 500 if an error during creation', async () => {
      const response = await request(app).post('/users').send({});
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Il y a une erreur." });
    });
  });

  describe('POST /users/login', () => {
    it('should log in a user and return a token', async () => {
      const testedUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      prismaMock.user.findUnique.mockResolvedValue(testedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

      const testedUser2 = {
        email: 'test@example.com',
        password: 'password'
      };

      const response = await request(app).post('/users/login').send(testedUser2);

      expect(response.status).toBe(201);
      expect(response.body).toEqual("Connexion réussie");
    });

    it('should return 400 if fields are missing', async () => {
      const response = await request(app).post('/users/login').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Champs requis manquants." });
    });

    it('should return 404 if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app).post('/users/login').send({
        email: 'test2@example.com',
        password: 'Password'
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "L'utilisateur n'existe pas." });
    });

    it('should return 400 if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app).post('/users/login').send({
        email: 'test@example.com',
        password: 'Password'
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Le mot de passe ne correspond pas à l'utilisateur." });
    });

    it('should return 500 if an error during login', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Erreur'));

      const response = await request(app).post('/users/login').send({
        email: 'test@example.com',
        password: 'password'
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Il y a une erreur." });
    });
  });


  describe('DELETE /users/delete/:userId', () => {
    it('should delete a User by ID', async () => {
      const deletedUser = {
        id: 2,
        email: "test@gmail.com",
        password: "Password"
      };

      prismaMock.user.delete.mockResolvedValue(deletedUser);

      const response = await request(app)
        .delete('/users/delete/2')

      expect(response.status).toBe(200);
      expect(response.body).toEqual("Utilisateur supprimé");
    });

    it('should return 400 for invalid ID', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('User not found'));

      const response = await request(app)
        .delete('/users/delete/96')

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "ID de l'utilisateur non valide." });
    });

    it('should return 500', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('Erreur'));

      const response = await request(app)
        .delete('/users/delete/100')

      expect(response.status).toBe(500);
      expect(response.body).toEqual("Error.");
    });
  });

  describe('PATCH /users/update/:userId', () => {
    it('should update an existing User', async () => {
      const patchUser = {
        email: "test@gmail.com",
        password: "Password"
      };

      const patchUser2 = {
        email: "test@gmail.com",
        password: "Password",
        userId: 5
      };

      prismaMock.user.update.mockResolvedValue(patchUser2);

      const response = await request(app)
        .patch("/users/update/5")
        .send(patchUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(patchUser2);
    });

    it('should return 400 if required fields are missing', async () => {
      const patchUser = {
        email: "test@gmail.com"
      };
      const response = await request(app)
        .patch('/users/update/26')
        .send(patchUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Il manque des informations." });
    });

    it('should return 400 for invalid ID', async () => {
      const updatedUser = {
        email: "test@gmail.com",
        password: "Password"
      };
      const response = await request(app)
        .patch('/users/update/96')
        .send(updatedUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "L'ID de l'utilisateur est invalide." });
    });

    it('should return 500 if an error during update', async () => {
      const updatedUser = {
        email: "test@gmail.com",
        password: "Password"
      };
      prismaMock.user.update.mockRejectedValue(new Error('Erreur'));

      const response = await request(app)
        .patch("/users/update/45")
        .send(updatedUser);

      expect(response.status).toBe(500);
      expect(response.body).toEqual("Error.");
    });

  });


});
