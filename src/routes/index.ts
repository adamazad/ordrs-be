import { Server } from '@hapi/hapi';
import Joi from 'joi';
import * as OrderControllers from '@controllers/orders';

export const validationSchema = {
  title: Joi.string(),
  bookingDate: Joi.date(),
  customer: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().pattern(new RegExp('[a-zA-Z]')).required(),
    phone: Joi.string(),
  }),
  address: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
    street: Joi.string().required(),
    zip: Joi.string().required(),
  }),
};

const register = async function register(server: Server) {
  const { address, bookingDate, customer, title } = validationSchema;

  server.route([
    {
      method: 'POST',
      path: '/orders',
      handler: OrderControllers.createOrder,
      options: {
        validate: {
          payload: Joi.object({
            title,
            address,
            bookingDate,
            customer,
          }).options({ presence: 'required' }),
        },
      },
    },
    {
      method: 'PUT',
      path: '/orders/{orderId}',
      handler: OrderControllers.updateOrder,
      options: {
        validate: {
          payload: Joi.object({
            title,
            bookingDate,
          }).min(1),
        },
      },
    },
  ]);
};

export default {
  register,
  name: 'routes',
  version: '1.0.0',
};
