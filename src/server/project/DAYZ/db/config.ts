import knex from 'knex';

const connection = {
    user: 'postgres',
    host: 'localhost',
    database: 'dayz',
    password: 'niishiro29122000',
    port: 5432,
  };
  
  const postgres = knex({
    client: 'pg',
    connection: connection,
  });
  
  export {
    postgres,
  }