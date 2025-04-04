import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Express } from 'express';
import * as request from 'supertest';
import { AppModule } from '~/app.module';
import { sql } from '~/db/sql';
import { ZodExceptionFilter } from '~/shared/zod-exception.filter';
import { TWorkspace } from '~/workspaces/workspaces.schema';

type LoginResponse = {
  body: {
    access_token: string;
  };
};

type GetWorkspacesResponse = request.Response & {
  body: TWorkspace[];
};

type CreateWorkspacesResponse = request.Response & {
  body: TWorkspace;
};
type ErrorResponse = request.Response & {
  body: {
    message: string;
  };
};

describe('WorkspacesController (e2e)', () => {
  let app: INestApplication<Express>;
  let authToken: string;
  const testUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    fullName: faker.person.fullName(),
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

    const loginResponse: LoginResponse = await request(app.getHttpServer())
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

      const response: GetWorkspacesResponse = await request(app.getHttpServer())
        .get('/workspaces')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body).toHaveProperty('[0].name', 'Test Workspace');
      expect(response.body).toHaveProperty('[0].ownerId');
    });

    it('should reject unauthorized requests', async () => {
      const response: ErrorResponse = await request(app.getHttpServer()).get(
        '/workspaces',
      );

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
        logoUrl: 'https://example.com/logo.png',
      };

      const response: CreateWorkspacesResponse = await request(
        app.getHttpServer(),
      )
        .post('/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workspaceData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('name', workspaceData.name);
      expect(response.body).toHaveProperty('logoUrl', workspaceData.logoUrl);
      expect(response.body).toHaveProperty('ownerId');
    });

    it('should create workspace with default empty logoUrl', async () => {
      const response: CreateWorkspacesResponse = await request(
        app.getHttpServer(),
      )
        .post('/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'No Logo Workspace' });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('name', 'No Logo Workspace');
      expect(response.body).toHaveProperty('logoUrl', '');
    });

    it('should reject invalid workspace data', async () => {
      const response: ErrorResponse = await request(app.getHttpServer())
        .post('/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty('message', 'Name is required');
    });
  });
});
