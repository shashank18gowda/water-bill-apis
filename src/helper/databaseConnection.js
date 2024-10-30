// import { Sequelize } from "sequelize";
// let connection = null;

// const getConnection = async () => {
//   if (!connection) {
//     connection = new Sequelize({
//       database: process.env.PGDATABASE ,
//       host: process.env.PGHOST,
//       username: process.env.PGUSER ,
//       password: process.env.PGPASSWORD ,
//       port: 5432,
//       dialect: "postgres",
//       pool: {
//         max: 5,
//         min: 0,
//         idle: 20000,
//         acquire: 20000,
//       },
//       logging: false,
//     });
//     connection
//       .authenticate()
//       .then(() => console.log("Database Connected Successfully"))
//       .catch((err) => console.log("Failed Connect Database", err.message));
//   }
//   return connection;
// };

// export default getConnection;

import pg from "pg";

const { Pool } = pg;

const getConnection = async () => {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  pool.connect((err) => {
    if (err) throw console.log("Failed Connect Database");;
    console.log("Database Connected Successfully");
  });
};

export default getConnection;
