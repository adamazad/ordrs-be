import { config, DotenvConfigOptions } from 'dotenv';

// Envrionement
export const NODE_ENV = process.env.NODE_ENV || 'development';

const options: DotenvConfigOptions = {};

if (NODE_ENV === 'test') {
  options.path = './.env.test';
}

config(options);

/**
 * Server
 */
export const SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'http';
export const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT || 4001;
export const SERVER_URL = `${SERVER_PROTOCOL}://${SERVER_PORT}:${SERVER_HOST}`;

// Preflight checklist
if ([SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT, SERVER_URL].some(v => v == undefined)) {
  throw new Error('Missing SERVER_* variables. Double check .env');
}

/**
 * Firebase service account
 * Decrypt base64, parse JSON and export
 */
let FIREBASE_SERVICE_ACCOUNT_JSON: Object;
{
  const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT as string, 'base64').toString();

  try {
    FIREBASE_SERVICE_ACCOUNT_JSON = JSON.parse(decoded);
  } catch (e) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT variable. Double check .env');
  }
}
export const FIREBASE_SERVICE_ACCOUNT = FIREBASE_SERVICE_ACCOUNT_JSON;

if (NODE_ENV !== 'test') {
  console.log({
    SERVER_PROTOCOL,
    SERVER_HOST,
    SERVER_PORT,
    SERVER_URL,
    NODE_ENV,
    FIREBASE_SERVICE_ACCOUNT,
  });
}
