// import pgPromise from 'pg-promise';
// const initOptions = {
//   error(err, e) {
//     console.log('err', err);
//     console.log('e', e);
//     if (e.cn) {
//         // this is a connection-related error
//         // cn = safe connection details passed into the library:
//         //      if password is present, it is masked by #
//     }

//     if (e.query) {
//         // query string is available
//         if (e.params) {
//             // query parameters are available
//         }
//     }

//     if (e.ctx) {
//         // occurred inside a task or transaction
//     }
//   },

//   connect(client, dc, useCount) {
//     const cp = client.connectionParameters;
//     console.log('Connected to database:', cp.database);
//   }
// };
// const pgp = pgPromise(initOptions);
// // Конфиг подключения.

// const connection = {
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'niishiro29122000',
//   database: 'dayz',
// };

// const db = pgp(connection); // db instance.

// db.any('SELECT * FROM users WHERE active = $1', [true])
//     .then(function(data) {
//         console.log('data', data);
//     })
//     .catch(function(error) {
//         // error;
//     });

//     console.log(db);

// export {
//   db,
// }

import { Pool, Client } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dayz',
  password: 'niishiro29122000',
  port: 5432,
});

(async () => {
  const string = 'SELECT * FROM spawnlootinfo';
  const result = await pool.query(string);
  console.log(result.rows);

  if (result.rows.length) {
    const spawnLootInfo = result;
    console.log('Данные есть!');
  }

  pool.end();
})();