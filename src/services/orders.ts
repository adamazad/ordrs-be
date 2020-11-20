import { firestore } from 'firebase-admin';
// Granular control
import { autoId } from '@google-cloud/firestore/build/src/util';
import { Order } from '@interfaces/Order';

const COLLECTION_NAME = 'orders';

export function getCollection() {
  return firestore().collection(COLLECTION_NAME);
}

export async function createOrder(orderData: Order) {
  const id = autoId();

  await getCollection()
    .doc(id)
    .create({
      id,
      ...orderData,
    });

  const docData = await getOrderById(id);

  return docData.data();
}

export function getOrderById(orderId: string) {
  return getCollection().doc(orderId).get();
}

export async function updateOrderById(orderId: string, orderData: Partial<Order>) {
  await getCollection().doc(orderId).update(orderData);

  const docData = await getOrderById(orderId);

  return docData.data();
}

/**
 * Converts to a Firestore Document to JSON, considering `firestore.Timestamp` objects
 * ```
 * const doc = {
    title: 'Order',
    createdAt: Timestamp { _seconds: 1554284950, _nanoseconds: 0 }
  }
  ```
  to
  ```
  const docJSON = {
    title: 'Order',
    createdAt: 1554284950000
  }
  ```
 * @param data
 */
export function toJSON(data?: firestore.DocumentData): Object {
  const DocJSON = {};

  for (let propName in data) {
    const propValue = data[propName];

    const isPrimitive = isValuePrimitive(propValue);
    // Convert Timestamp to miliseconds
    if (propValue instanceof firestore.Timestamp) {
      DocJSON[propName] = propValue.toMillis();
    } else if (isPrimitive) {
      DocJSON[propName] = propValue;
    }
    // Complex types
    else if (typeof propValue === 'object') {
      DocJSON[propName] = toJSON(propValue);
    }
  }

  return DocJSON;
}

function isValuePrimitive(val: any) {
  return ['string', 'number', 'boolean', 'bigint'].includes(typeof val) || val === null;
}
