import 'dotenv/config';
import { DataSource } from 'typeorm';
import databaseConfig from './src/providers/database';

export const connectionSource = new DataSource(databaseConfig);
