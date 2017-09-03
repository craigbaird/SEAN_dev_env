var pg = require('pg');
var url = require('url');
var config = {};

if (process.env.DATABASE_URL) {

  var params = url.parse(process.env.DATABASE_URL);
  var auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true, // heroku requires ssl to be true
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 90000, // how long a client is allowed to remain idle before being closed
  };

} else {
  config = {
    user: (process.env.PGUSER || ''), //env var: PGUSER
    database: (process.env.PGDATABASE || 'ssg_registration'), //env var: PGDATABASE
    password: (process.env.PGPASSWORD || ''), //env var: PGPASSWORD
    port: (process.env.PGPORT || 5432), //env var: PGPORT
    host: (process.env.PGHOST || 'localhost'),
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 90000, // 1.5s // how long a client is allowed to remain idle before being closed
  };
}

module.exports = new pg.Pool(config);
