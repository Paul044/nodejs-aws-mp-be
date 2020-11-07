import { ClientConfig } from 'pg';

const dbOptions: ClientConfig = {
  host: process.env.PG_HOST,
  port: parseInt(process.env.PORT || '', 10),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // to avoid warring in this example
  },
  connectionTimeoutMillis: 5000, // time in millisecond for termination of the database query,
};

export default dbOptions;
