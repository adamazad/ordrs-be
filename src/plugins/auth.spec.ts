import Hapi from '@hapi/hapi';
import FirebaseAuthPlugin from './auth';

describe('Hapi Firebase Auth plugin', () => {
  test('It should export register, name and version', () => {
    expect(FirebaseAuthPlugin.name).toBe('firebase-auth-plugin');
    expect(FirebaseAuthPlugin.version).toBeDefined();
    expect(typeof FirebaseAuthPlugin.register).toBe('function');
  });

  describe('register', () => {
    test('It should register with server', async () => {
      let testServer = new Hapi.Server({
        host: 'localhost',
        port: 3000,
      });

      await testServer.register(FirebaseAuthPlugin);
      expect(testServer.auth.settings.default.strategies).toContain('firebase');
    });
  });
});
