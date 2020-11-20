import { auth } from 'firebase-admin';
import { Request } from '@hapi/hapi';
import { Order } from './Order';

declare module '@hapi/hapi' {
  export interface UserCredentials extends auth.DecodedIdToken {}
}

export interface ICreateOrderRequest extends Request {
  payload: Omit<Order, 'uid'>;
}

export interface IOrderRequest extends Request {
  params: {
    orderId: string;
  };
}

export interface IUpdateOrderRequest extends Request {
  params: {
    orderId: string;
  };
  payload: {
    title: string;
    bookingDate: number;
  };
}
