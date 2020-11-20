import { ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';

import { ICreateOrderRequest, IUpdateOrderRequest } from '@interfaces/Request';
import * as OrdersService from '@services/orders';

export async function createOrder(req: ICreateOrderRequest) {
  try {
    const newOrder = await OrdersService.createOrder({
      ...req.payload,
      uid: req.auth.credentials.uid as string,
    });

    return OrdersService.toJSON(newOrder);
  } catch (e) {
    return Boom.badRequest(e);
  }
}

export async function updateOrder(req: IUpdateOrderRequest, h: ResponseToolkit) {
  try {
    await OrdersService.updateOrderById(req.params.orderId, req.payload);

    return h.response().code(204);
  } catch (e) {
    return Boom.badRequest(e);
  }
}
