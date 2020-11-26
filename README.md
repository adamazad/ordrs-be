# Setup

## Clone

In terminal, run

```
$ git clone https://github.com/adamazad/ordrs-be.git
$ cd ordrs-be
```

## Install dependencies

Install dependencies via NPM, run:

```
$ npm install
```

## Setup environment

Crate a copy of `.env.sample` and rename it to `.env`

```
$ cp .env.sample .env
```

### Firebase Service

Because this project uses Firestore, you need to create a service account at [Firebase Console](https://console.firebase.google.com/).

**1. Create Service Account**

Create a service account, and download the JSON. It will look like the following:

```
{
  "type": "service_account",
  "project_id": "<project-id>",
  "private_key_id": "123456789098765432",
  "private_key": "<private-key>",
  "client_email": "firebase-adminsdk@project.iam.gserviceaccount.com",
  "client_id": "123456788765432345676543",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40project.iam.gserviceaccount.com"
}
```

**2. Stringify**

For instance the above JSON, the string version will be (it is compat):

```
{"type":"service_account","project_id":"<project-id>","private_key_id":"123456789098765432","private_key":"<private-key>","client_email":"firebase-adminsdk@project.iam.gserviceaccount.com","client_id":"123456788765432345676543","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40project.iam.gserviceaccount.com"}
```

Then encode it to base64 string using any tool like [base64encode.org](https://www.base64encode.org/)

```
eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJvamVjdF9pZCI6Ijxwcm9qZWN0LWlkPiIsInByaXZhdGVfa2V5X2lkIjoiMTIzNDU2Nzg5MDk4NzY1NDMyIiwicHJpdmF0ZV9rZXkiOiI8cHJpdmF0ZS1rZXk+IiwiY2xpZW50X2VtYWlsIjoiZmlyZWJhc2UtYWRtaW5zZGtAcHJvamVjdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImNsaWVudF9pZCI6IjEyMzQ1Njc4ODc2NTQzMjM0NTY3NjU0MyIsImF1dGhfdXJpIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLCJ0b2tlbl91cmkiOiJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsImNsaWVudF94NTA5X2NlcnRfdXJsIjoiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9maXJlYmFzZS1hZG1pbnNkayU0MHByb2plY3QuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20ifQ==
```

Now use above string for `FIREBASE_SERVICE_ACCOUNT` in the `.env` file

## Develop

Now you can start developing! To run a development instance, run

```
$ npm run watch
```

This will watch for changes in `src` directory and reload the server.

## Testing

Test via Jest, run:

```
npm test
```

Coverage report is available in `coverage` directory and terminal.

## Building

To compile Typescript, run:

```
$ npm run build
```

# Deployment

Server can be deployed using [PM2](https://pm2.io). The configurations are in `ecosystem.config.js`. In command line, type:

```
$ pm2 start ecosystem.config.js
```

Each server is configured to have have to insatnces, which is more than enough for a small-scale application.

Logs can be traced using

```
$ pm2 logs
```

# Scripts

`package.json` has the following commands, you can run them using `npm run <command>`

| Command    | Description                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| `test`     | Runs tests via jest                                                                        |
| `env:dev`  | Sets `NODE_ENV` to `development`. This commands is used by `watch`                         |
| `env:dev`  | Sets `NODE_ENV` to `production`                                                            |
| `watch`    | Start a development server via `nodemon` and watches for changes in `src`                  |
| `lint`     | Lints all files in `src` according to according to rules in [`.eslintrc.js`](.eslintrc.js) |
| `lint:fix` | Lints and formats all files in `src` according to rules in [`.eslintrc.js`](.eslintrc.js)  |
| `build`    | Create a production build                                                                  |
| `prebuild` | Removes old `build` before building                                                        |

# Proxy

You can setup an Nginx proxy like this:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name api.orders.io;
  location / {
    proxy_pass http://127.0.0.1:4001;
  }
}
```

Make sure to change the port to match the one set in `.env`
