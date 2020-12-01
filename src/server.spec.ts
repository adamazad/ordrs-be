import { Server } from '@hapi/hapi';
import * as server from './server';

describe('Server', () => {
  test('It should export init and server', () => {
    expect(typeof server.init).toBe('function');
    expect(typeof server.start).toBe('function');
  });
});
