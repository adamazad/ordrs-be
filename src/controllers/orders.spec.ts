import { Server } from '@hapi/hapi';
import { init } from '../server';

describe('Order Routes', () => {
  let server: Server;

  let mockAuth = {
    credentials: {
      uid: 'mAki6IXiNnhX2RW7vGiWKXr7cxm2',
    },
    strategy: 'firebase',
  };

  let mockOrder = {
    address: {
      city: 'Berlin',
      country: 'Germany',
      street: 'Wriezener Str. 12',
      zip: '13055',
    },
    bookingDate: 1554284950000,
    customer: {
      email: 'test@test.de',
      name: 'Test User',
      phone: '015252098067',
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
    test('Should update order', async () => {
      // Create new order
      const newOrderRes = await server.inject({
        method: 'POST',
        url: `/orders`,
        payload: mockOrder,
        auth: mockAuth,
      });

      const { id } = newOrderRes.result as any;

      // Only title and bookingDate can be updated
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
