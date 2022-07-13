import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

const DATABASE_TYPE: any = String(process.env.DB_TYPE) || 'mysql';

const dataSourceConnection: DataSourceOptions = {
  type: DATABASE_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '/../**/**.entity.{ts,js}')],
  migrations: [join(__dirname, '/../migrations/**/*.{ts,js}')],
};

export default dataSourceConnection;
