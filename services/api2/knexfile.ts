import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const knexConfig = {
  test: {
    client: 'pg',
    version: '13',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: join(process.cwd(), 'src/modules/database/migrations'),
    },
  },

  local: {
    client: 'pg',
    version: '13',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: join(process.cwd(), 'src/modules/database/migrations'),
    },
  },

  development: {
    client: 'pg',
    version: '13',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: join(process.cwd(), 'src/modules/database/migrations'),
    },
  },

  production: {
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: join(process.cwd(), 'src/modules/database/migrations'),
    },
  },
};

export default knexConfig;
