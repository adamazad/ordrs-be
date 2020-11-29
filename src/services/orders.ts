import { firestore } from 'firebase-admin';
// Granular control
import { autoId } from '@google-cloud/firestore/build/src/util';
import { Order } from '@interfaces/Order';

const COLLECTION_NAME = 'orders';

/**
 * Returns the Firebase reference to the collection
 */
export function getCollection() {
  return firestore().collection(COLLECTION_NAME);
}

/**
 * Creates and returns a new order document
 * @param orderId
 */
export async function createOrder(orderData: Order): Promise<Order> {
  const id = autoId();

  await getCollection()
    .doc(id)
    .create({
      id,
      ...orderData,
    });

  const docData = await getOrderById(id);

  return docData.data() as Order;
}

/**
 * Returns an order reference by Id
 * @param orderId
 */
export function getOrderById(orderId: string) {
  return getCollection().doc(orderId).get();
}

/**
 * Updaates an order document by Id
 * @param orderId
 */
export async function updateOrderById(
  orderId: string,
  orderData: Partial<Pick<Order, 'bookingDate' | 'title'>>
): Promise<Order> {
  await getCollection().doc(orderId).update(orderData);

  const docData = await getOrderById(orderId);

  return docData.data() as Order;
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
  // Base case
  // Convert Timestamp to miliseconds
  // Return the primitive type
  const isPrimitive = isValuePrimitive(data);
  if (data instanceof firestore.Timestamp) {
    return data.toMillis();
  } else if (isPrimitive) {
    return data as any;
  }

  // Arrays are mapped
  if (Array.isArray(data)) {
    return data.map(toJSON);
  }

  // Object values are mapped
  const DocJSON = {};

  for (let propName in data) {
    const propValue = data[propName];
    DocJSON[propName] = toJSON(propValue);
  }

  return DocJSON;
}

/**
 * Checks if a value it primitive
 * @param {any} val
 */
function isValuePrimitive(val: any) {
  return ['string', 'number', 'boolean', 'bigint'].includes(typeof val) || val === null;
}
