import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '~/app.module';
import { sql } from '~/db/sql';
import { ZodExceptionFilter } from '~/shared/zod-exception.filter';

describe('WorkspacesController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const testUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    full_name: faker.person.fullName(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ZodExceptionFilter());
    await app.init();

    // Register and login test user
    await request(app.getHttpServer()).post('/auth/register').send(testUser);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await sql`DELETE FROM users WHERE email = ${testUser.email}`;
    await app.close();
  });

  describe('GET /workspaces', () => {
    it('should return empty array when no workspaces exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/workspaces')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it('should return user workspaces', async () => {
      // Create test workspace
      await request(app.getHttpServer())
        .post('/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Workspace' });

      const response = await request(app.getHttpServer())
        .get('/workspaces')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Test Workspace');
      expect(response.body[0]).toHaveProperty('owner_id');
    });

    it('should reject unauthorized requests', async () => {
      const response = await request(app.getHttpServer()).get('/workspaces');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toHaveProperty(
        'message',
        'Authorization header missing or invalid',
      );
    });
  });

  describe('POST /workspaces', () => {
    it('should create new workspace', async () => {
      const workspaceData = {
        name: 'New Workspace',
        logo_url: 'https://example.com/logo.png',
      };

      const response = await request(app.getHttpServer())
        .post('/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workspaceData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('name', workspaceData.name);
      expect(response.body).toHaveProperty('logo_url', workspaceData.logo_url);
      expect(response.body).toHaveProperty('owner_id');
    });

    it('should create workspace with default empty logo_url', async () => {
      const response = await request(app.getHttpServer())
        .post('/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'No Logo Workspace' });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('name', 'No Logo Workspace');
      expect(response.body).toHaveProperty('logo_url', '');
    });

    it('should reject invalid workspace data', async () => {
      const response = await request(app.getHttpServer())
        .post('/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty('message', 'Name is required');
    });
  });
});
