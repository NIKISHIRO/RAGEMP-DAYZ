import knex from 'knex';
import './tables';
const dbConfig = require('./knexfile');

const postgres = knex(dbConfig.development);

export {
    postgres,
}