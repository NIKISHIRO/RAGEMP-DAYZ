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
        table.specificType('inventory', 'jsonb[]');
    });

    await knex.schema.createTable('spawnlootinfo', (table) => {
        table.increments().primary();
        table.specificType('items', 'varchar(100)[]').notNullable();
        table.specificType('position', 'real[]').notNullable();
        // table.integer('playerId').notNullable();
        // table.foreign('playerId').references('players.id').onDelete('cascade');
    });
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('spawnlootinfo').dropTable('players');
}