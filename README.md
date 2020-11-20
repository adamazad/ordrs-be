# Building

Run

```
$ npm run build
```

# Deployment

Crate a copy of `.env.sample` and rename it to `.env`

## Firebase service

`FIREBASE_SERVICE_ACCOUNT` must be base64 encoded JSON string. See [`src/constants/index.ts`](src/constants/index.ts)

```
$ cp .env.sample .env
```

Both servers can be deployed using [PM2](https://pm2.io) in a single command. The configurations are in `ecosystem.config.js`. In command line, type:

```
$ pm2 start ecosystem.config.js
```

Each server is configured to have have to insatnces, which is more than enough for a small-scale application.

Logs can be traced using

```
$ pm2 logs
```

# Proxy

You can setup an Nginx proxy like this:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name auth.app.io;
  location / {
    proxy_pass http://127.0.0.1:4001;
  }
}
```
