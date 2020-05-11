const DEV_DB = 'dayz_test';
const PROD_DB = 'dayz';

module.exports = {
  development: {
    client: "pg",
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: DEV_DB,
      password: 'niishiro29122000',
      port: 5432,
    },
    migrations: {
      directory: './migrations',
      tableName: "knex_migrations",
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: "pg",
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: PROD_DB,
      password: 'niishiro29122000',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: "knex_migrations",
    }
  }
};