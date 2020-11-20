import CatboxMemory from '@hapi/catbox-memory';
import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import Joi from 'joi';

import { SERVER_PORT, SERVER_HOST, NODE_ENV } from '@constants';
import './init/firebase-admin';

const server = Hapi.server({
  port: SERVER_PORT,
  host: SERVER_HOST,
  cache: {
    engine: new CatboxMemory(),
    name: 'memory',
  },
  routes: {
    cors: true,
    auth: 'firebase',
    validate: {
      failAction: async (request, h, err) => {
        if (NODE_ENV === 'production') {
          // In prod, log a limited error message and throw the default Bad Request error.
          console.error('ValidationError:', err?.message);
          throw Boom.badRequest(`Invalid request payload input`);
        } else {
          // During development, log and respond with the full error.
          console.error(err);
          throw err;
        }
      },
    },
  },
});

export async function init() {
  // Hook Joi validator
  server.validator(Joi);

  // Firebase auth strategy
  await server.register(require('./plugins/auth').default);

  // Rate-limit
  // Only in production
  if (NODE_ENV === 'production') {
    await server.register({
      plugin: require('hapi-rate-limit').default,
      options: {
        userLimit: 100,
      },
    });
  }

  // Register routes
  await server.register(require('./routes').default);

  return server;
}

export async function start() {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
}
