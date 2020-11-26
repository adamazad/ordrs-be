import { autoId } from '@google-cloud/firestore/build/src/util';
import { firestore } from 'firebase-admin';
import Faker from 'faker';

import '@constants';
import '../init/firebase-admin';
import * as OrdersService from './orders';

describe('Orders Service', () => {
  let collectionName = 'orders';

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
    uid: autoId(),
  };

  describe('getCollection', () => {
    test('It should be a Firestore Collection ref', () => {
      expect(OrdersService.getCollection()).toBeInstanceOf(firestore.CollectionReference);
    });
    test('Its collection name should be orders', () => {
      expect(OrdersService.getCollection().id).toBe(collectionName);
    });
  });

  describe('createOrder', () => {
    test('It should create the order', async () => {
      const createdOrder = await OrdersService.createOrder(mockOrder);

      expect(createdOrder.uid).toEqual(mockOrder.uid);
      expect(createdOrder.customer).toEqual(expect.objectContaining(mockOrder.customer));
      expect(createdOrder.address).toEqual(expect.objectContaining(mockOrder.address));
      expect(createdOrder.bookingDate).toEqual(mockOrder.bookingDate);
    });
  });

  describe('updateOrderById', () => {
    test('It should update the order', async () => {
      // Create order
      const createdOrder = await OrdersService.createOrder(mockOrder);

      expect(createdOrder.uid).toEqual(mockOrder.uid);
      expect(createdOrder.customer).toEqual(expect.objectContaining(mockOrder.customer));
      expect(createdOrder.address).toEqual(expect.objectContaining(mockOrder.address));
      expect(createdOrder.bookingDate).toEqual(mockOrder.bookingDate);

      // Update the order

      const updatePayload = {
        bookingDate: Faker.date.future().getTime(),
      };
      const updatedOrder = await OrdersService.updateOrderById(createdOrder.id, updatePayload);

      expect(updatedOrder.uid).toEqual(mockOrder.uid);
      expect(updatedOrder.customer).toEqual(expect.objectContaining(mockOrder.customer));
      expect(updatedOrder.address).toEqual(expect.objectContaining(mockOrder.address));
      expect(updatedOrder.bookingDate).toEqual(updatePayload.bookingDate);
    });
  });

  describe('toJSON', () => {
    test('it should convert firestore.Timestamp type to miliseconds', () => {
      const timestamp = Math.round(Date.now() / 1000);

      const doc = {
        title: 'Hello world',
        createdAt: new firestore.Timestamp(timestamp, 0),
      };

      expect(OrdersService.toJSON(doc)).toMatchObject({
        title: 'Hello world',
        createdAt: timestamp * 1000,
      });
    });
  });
});
