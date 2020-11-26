import { autoId } from '@google-cloud/firestore/build/src/util';
import { Server } from '@hapi/hapi';
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
    test('Should create a new order', async () => {
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
    test(`Should update order's bookingDate`, async () => {
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

    test(`Should update order's title`, async () => {
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
