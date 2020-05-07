import knex from 'knex';
const dbConfig = require('./knexfile');

const postgres = knex(dbConfig.development);

export {
    postgres,
}