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
    test('It should convert firestore.Timestamp type to miliseconds', () => {
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

    test('It should handle arrays', () => {
      // Test fields
      const createdAt = [
        new firestore.Timestamp(Math.round(Date.now() / 1000), 0),
        new firestore.Timestamp(Math.round(Date.now() / 1000), 0),
        new firestore.Timestamp(Math.round(Date.now() / 1000), 0),
      ];
      const emails = [Faker.internet.email(), Faker.internet.email(), Faker.internet.email()];
      const username = Faker.internet.userName();

      const doc = {
        username,
        emails,
        createdAt,
      };

      expect(OrdersService.toJSON(doc)).toMatchObject({
        username,
        emails,
        createdAt: createdAt.map(ts => ts.toMillis()),
      });
    });

    test('It should handle deep objects', () => {
      const createdAt = new firestore.Timestamp(Math.round(Date.now() / 1000), 0);
      const emails = [Faker.internet.email(), Faker.internet.email(), Faker.internet.email()];
      const username = Faker.internet.userName();
      // user.photo field
      const photo = {
        createdAt,
        url: Faker.internet.avatar(),
      };

      // Deep object
      const articles = [
        {
          createdAt,
          title: Faker.lorem.sentence(),
          content: Faker.lorem.paragraph(),
          author: {
            photo,
            createdAt,
            email: Faker.internet.email(),
          },
        },
        {
          createdAt,
          title: Faker.lorem.sentence(),
          content: Faker.lorem.paragraph(),
          author: {
            photo,
            createdAt,
            email: Faker.internet.email(),
          },
        },
      ];

      const doc = {
        username,
        emails,
        createdAt,
        articles,
      };

      const expectedDoc = {
        username,
        emails,
        // Manually convert all FirebaseFirestore.Timestamp to miliseconds
        articles: articles.map(article => ({
          ...article,
          createdAt: article.createdAt.toMillis(),
          author: {
            ...article.author,
            createdAt: article.author.createdAt.toMillis(),
            photo: {
              ...article.author.photo,
              createdAt: article.author.photo.createdAt.toMillis(),
            },
          },
        })),
        createdAt: createdAt.toMillis(),
      };

      expect(OrdersService.toJSON(doc)).toMatchObject(expectedDoc);
    });
  });
});
