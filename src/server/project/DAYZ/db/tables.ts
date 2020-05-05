import { postgres } from "./config";

// Создание таблиц, которых нет в БД.
async function createTables() {

    // Таблица создания точек с лутом.
    if (!await postgres.schema.hasTable('spawnlootinfo')) {
        await postgres.schema.createTable('spawnlootinfo', (table) => {
            table.increments().primary();
            table.specificType('items', 'varchar(100)[]').notNullable();
            table.specificType('position', 'real[]').notNullable();
        });
        
        console.log('[TABLE]: spawnlootinfo была создана.'.green);
    }
}

createTables();