import { autoId } from '@google-cloud/firestore/build/src/util';
import { Server } from '@hapi/hapi';
import G from 'generatorics';
import Faker from 'faker';

import { init } from '../server';

describe('Order Routes', () => {
  let server: Server;

  let mockAuth = {
    credentials: {
      uid: autoId(),
    },
    strategy: 'firebase',
  };

  let mockOrder = {
    address: {
      city: Faker.address.city(),
      country: Faker.address.country(),
      street: Faker.address.streetAddress(),
      zip: Faker.address.zipCode(),
    },
    bookingDate: Faker.date.future().getTime(),
    customer: {
      email: Faker.internet.email(),
      name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
      phone: Faker.phone.phoneNumber(),
    },
    title: 'Test Order 1',
  };

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('POST /orders', () => {
    test('It should return 401 without props authentication', async () => {
      const { statusCode } = await server.inject({
        method: 'POST',
        url: '/orders',
      });
      expect(statusCode).toBe(401);
    });

    describe('payload', () => {
      const payloadKeys = Object.keys(mockOrder);
      // Generate all possible powerets
      for (const payload of G.combination(payloadKeys, 3)) {
        test(`It should fail with payload having only ${payload.join(', ')}`, async () => {
          const { statusCode } = await server.inject({
            method: 'POST',
            url: '/orders',
            auth: mockAuth,
            payload,
          });
          expect(statusCode).toBe(400);
        });
      }
    });

    test('It should create a new order with correct payload', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/orders',
        payload: mockOrder,
        auth: mockAuth,
      });
      expect(res.statusCode).toBe(200);
      expect(res.result).toMatchObject({
        ...mockOrder,
        id: expect.any(String),
      });
    });
  });

  describe('PUT /orders', () => {
    test('It should return 401 without props authentication', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/orders/${autoId()}`, // arbitrary order Id
      });

      expect(res.statusCode).toBe(401);
    });

    test('It should fail to update nonexsiting orders', async () => {
      const { statusCode, result } = await server.inject({
        method: 'PUT',
        url: `/orders/${autoId()}`, // arbitrary order Id
        auth: mockAuth,
        payload: {
          bookingDate: Faker.date.future().getTime(),
        },
      });

      expect(statusCode).toBe(400);
      expect((result as any).message).toContain('NOT_FOUND');
    });

    test(`It should update order's bookingDate`, async () => {
      // Create new order
      const newOrderRes = await server.inject({
        method: 'POST',
        url: `/orders`,
        payload: mockOrder,
        auth: mockAuth,
      });

      const { id } = newOrderRes.result as any;

      // Update the title
      const updatedMockOrder = {
        bookingDate: Faker.date.future().getTime(),
      };

      const updatedOrderRes = await server.inject({
        method: 'PUT',
        url: `/orders/${id}`,
        payload: updatedMockOrder,
        auth: mockAuth,
      });

      expect(updatedOrderRes.statusCode).toBe(204);
    });

    test(`It should update order's title`, async () => {
      // Create new order
      const newOrderRes = await server.inject({
        method: 'POST',
        url: `/orders`,
        payload: mockOrder,
        auth: mockAuth,
      });

      const { id } = newOrderRes.result as any;

      // Update the title
      const updatedMockOrder = {
        title: 'Updated Test',
      };

      const updatedOrderRes = await server.inject({
        method: 'PUT',
        url: `/orders/${id}`,
        payload: updatedMockOrder,
        auth: mockAuth,
      });

      expect(updatedOrderRes.statusCode).toBe(204);
    });
  });
});
