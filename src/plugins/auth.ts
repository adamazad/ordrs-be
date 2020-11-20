import AuthBearer from 'hapi-auth-bearer-token';
import { auth } from 'firebase-admin';
import { Server } from '@hapi/hapi';

async function register(server: Server) {
  await server.register(AuthBearer);

  server.auth.strategy('firebase', 'bearer-access-token', {
    allowQueryToken: true,
    validate: async function validate(req: Request, token: string) {
      let credentials: auth.DecodedIdToken | null = null;
      let isValid = false;

      try {
        if (token) {
          credentials = await auth().verifyIdToken(token);
          isValid = true;
        }
      } catch (e) {
        // Send to sentry
        console.log({ e });
      }

      return {
        credentials,
        isValid,
      };
    },
  });

  server.auth.default('firebase');
}

export default {
  register,
  version: '1.0.0',
  name: 'firebase-auth-plugin',
};
