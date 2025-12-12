const request = require('supertest');
const app = require('../app');

const User = require('../models/users');

// TESTS ROUTE /USERS/SIGNUP
it('POST /users/signup should return an error without all infos', async () => {
  const newUser = {
    firstName: 'Heisenberg',
    email: 'iamthedanger@abq.com',
    password: 'saymyname',
  };
  const response = await request(app).post('/users/signup').send(newUser);
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('result', false);
  expect(response.body).toHaveProperty('error', 'Des informations sont manquantes.');
});

it('POST /users/signup should return an error for wrong email format', async () => {
  const newUser = {
    lastName: 'Wayne',
    firstName: 'Bruce',
    email: 'b-at-mail.com',
    password: 'selina4ever',
  };
  const response = await request(app).post('/users/signup').send(newUser);
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('result', false);
  expect(response.body).toHaveProperty('error', 'Email invalide.');
});

it('POST /users/signup should return an error for short password', async () => {
  const newUser = {
    lastName: 'Astley',
    firstName: 'Rick',
    email: 'nevergonnagiveyouup@nevergonnaletyou.down',
    password: 'never',
  };
  const response = await request(app).post('/users/signup').send(newUser);
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('result', false);
  expect(response.body).toHaveProperty(
    'error',
    'Le mot de passe doit contenir au moins 6 caractères.'
  );
});

it('POST /users/signup should create a new user', async () => {
  const newUser = {
    lastName: 'Lasso',
    firstName: 'Ted',
    email: 't.lasso@richmond.co.uk',
    password: 'believe123',
  };
  const response = await request(app).post('/users/signup').send(newUser);
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('result', true);
  expect(response.body).toHaveProperty('user');
  expect(response.body.user).toHaveProperty('token');
  // delete the test user after creation
  const deleteResult = await User.deleteOne({ email: newUser.email });
  expect(deleteResult.deletedCount).toBe(1);
});

it('POST /users/signup should return an error for existing email', async () => {
  const newUser = {
    lastName: 'Bond',
    firstName: 'James',
    email: 'bond@mi.io',
    password: 'shakenNotStirred',
  };

  const response = await request(app).post('/users/signup').send(newUser);
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('result', false);
  expect(response.body).toHaveProperty('error', 'Cet email est déjà utilisé.');
});

// TESTS ROUTE /USERS/AUTH
it('POST /users/auth should login an existing user', async () => {
  const existingUser = {
    email: 'sponge.bob@gmail.com',
    password: 'qwerty',
  };
  const response = await request(app).post('/users/auth').send(existingUser);
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('result', true);
  expect(response.body).toHaveProperty('user');
  expect(response.body.user).toHaveProperty('token');
});

it('POST /users/auth should return an error with wrong password', async () => {
  const existingUser = {
    email: 'sponge.bob@gmail.com',
    password: 'wrongpassword',
  };
  const response = await request(app).post('/users/auth').send(existingUser);
  expect(response.statusCode).toBe(403);
  expect(response.body).toHaveProperty('result', false);
  expect(response.body).toHaveProperty('error', 'Mot de passe incorrect');
});

it('POST /users/auth should return an error for non-existing user', async () => {
  const nonExistingUser = {
    email: 'johncena@visible.xyz',
    password: 'youcantsee',
  };
  const response = await request(app).post('/users/auth').send(nonExistingUser);
  expect(response.statusCode).toBe(404);
  expect(response.body).toHaveProperty('result', false);
  expect(response.body).toHaveProperty('error', 'Utilisateur introuvable');
});

afterAll(() => {
  // Close the server or database connection if needed
  const mongoose = require('mongoose');
  mongoose.connection.close();
});
