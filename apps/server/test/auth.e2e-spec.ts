import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { z } from 'zod';
import { AppModule } from '~/app.module';
import { sql } from '~/db/sql';
import { TUserBody } from '~/users/users.schema';
import { ZodExceptionFilter } from '~/shared/zod-exception.filter';

const RegisterResponseSchema = z.object({
  message: z.string(),
});

const LoginResponseSchema = z.object({
  access_token: z.string(),
});

const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string(),
});

const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

describe('AuthController (e2e)', () => {
  let app: INestApplication<Express>;
  const testUser: TUserBody = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    full_name: faker.person.fullName(),
  };
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ZodExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await sql`DELETE FROM users WHERE email = ${testUser.email}`;
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(HttpStatus.CREATED);

      const body = RegisterResponseSchema.parse(response.body);
      expect(body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not allow duplicate email registration', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(HttpStatus.CONFLICT);

      const body = ErrorResponseSchema.parse(response.body);
      expect(body).toHaveProperty('message', 'Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(HttpStatus.OK);

      const body = LoginResponseSchema.parse(response.body);
      expect(body).toHaveProperty(
        'access_token',
        expect.stringMatching(/^eyJ/),
      );
      authToken = body.access_token;
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      const body = ErrorResponseSchema.parse(response.body);
      expect(body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('GET /auth/me', () => {
    it('should get current user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);

      const body = UserProfileSchema.parse(response.body);
      expect(body).toHaveProperty('email', testUser.email);
      expect(body).toHaveProperty('full_name', testUser.full_name);
      expect(body).toHaveProperty('id');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not allow access without token', async () => {
      const response = await request(app.getHttpServer()).get('/auth/me');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      const body = ErrorResponseSchema.parse(response.body);
      expect(body).toHaveProperty(
        'message',
        'Authorization header missing or invalid',
      );
    });

    it('should reject malformed JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer malformed.jwt.token');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      const body = ErrorResponseSchema.parse(response.body);
      expect(body).toHaveProperty('message', 'Invalid or expired token');
    });

    it('should reject expired JWT token', async () => {
      const expiredToken = jwt.sign(
        { sub: 'user_id', email: testUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' },
      );

      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      const body = ErrorResponseSchema.parse(response.body);
      expect(body).toHaveProperty('message', 'Invalid or expired token');
    });

    it('should reject token with invalid signature', async () => {
      const invalidSignatureToken = jwt.sign(
        { sub: 'user_id', email: testUser.email },
        'invalid-secret',
      );

      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${invalidSignatureToken}`);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      const body = ErrorResponseSchema.parse(response.body);
      expect(body).toHaveProperty('message', 'Invalid or expired token');
    });

    it('should reject token without subject claim', async () => {
      const noSubToken = jwt.sign(
        { email: testUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );

      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${noSubToken}`);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      const body = ErrorResponseSchema.parse(response.body);
      expect(body).toHaveProperty('message', 'Invalid or expired token');
    });
  });
});
