import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('players', (table) => {
        table.increments().primary();
        table.text('login').notNullable();
        table.text('passwordHash').notNullable();
        table.text('email').notNullable();
        table.integer('health');
        table.integer('armor');
        table.integer('hunger');
        table.integer('dehydration');
        table.integer('admin').notNullable().defaultTo(0);
        table.specificType('position', 'jsonb');
        table.specificType('gender', 'varchar(10)');
        table.specificType('face', 'jsonb[]');
        table.specificType('headblend', 'jsonb[]');
        table.specificType('clothes', 'integer[]');
        table.specificType('inventory', 'jsonb[]');
    });

    await knex.schema.createTable('spawnlootinfo', (table) => {
        table.increments().primary();
        table.specificType('items', 'varchar(100)[]').notNullable();
        table.specificType('position', 'real[]').notNullable();
        // table.integer('playerId').notNullable();
        // table.foreign('playerId').references('players.id').onDelete('cascade');
    });

    await knex.schema.createTable('vehiclespawn', (table) => {
        table.increments().primary();
        table.text('hash').notNullable();
        table.text('description').notNullable();
        table.specificType('color', 'integer[]').notNullable();
        table.jsonb('defaultposition').notNullable();
        table.jsonb('saveposition').notNullable();
        table.jsonb('rotation').notNullable();
        table.boolean('isExplode').notNullable().defaultTo(false);
    });
}
export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('spawnlootinfo').dropTable('players').dropTable('vehiclespawn');
}