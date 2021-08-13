import { Connection, createConnection } from 'typeorm';
import { RPLog } from '../entities/rpLog';
import { Border } from '../entities/border';

export class DBManager {
  public static async getConnectionAsync(): Promise<Connection> {
    return await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      entities: [RPLog, Border],
      logging: false
    });
  }
}
