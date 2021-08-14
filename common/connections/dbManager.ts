import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { RPLog } from '../entities/rpLog';
import { Border } from '../entities/border';

export class DBManager {
  public static async getConnectionAsync(): Promise<Connection> {
    const option: ConnectionOptions = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      entities: [RPLog, Border],
      logging: false
    };
    const manager = getConnectionManager();
    let connection: Connection;
    // すでにあるならそれを使用
    if (manager.has('default')) {
      connection = manager.get('default');
    }
    // 新規作成
    if (!connection?.isConnected) {
      connection = await createConnection(option);
    }
    return connection;
  }
}
