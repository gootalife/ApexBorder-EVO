import { Between, In } from 'typeorm';
import platforms from '../../common/platforms.json';
import { DBManager } from '../../common/connections/dbManager';
import { Border } from '../../common/entities/border';
import { RPLog } from '../../common/entities/rpLog';

export async function getRPLogsBetweenAsync(beginning: string, ending: string): Promise<RPLog[]> {
  let rpLogs: RPLog[] = [];
  let connection = await DBManager.getConnectionAsync();
  try {
    const repository = connection.getRepository(RPLog);
    // 期間内の記録を取得
    rpLogs = await repository.find({
      where: {
        date: Between(beginning + ' 00:00:00', ending + ' 23:59:59')
      },
      order: {
        date: 'ASC'
      }
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
  return rpLogs;
}

export async function getRPLogsOnSeasonAsync(season: string): Promise<RPLog[]> {
  let rpLogs: RPLog[] = [];
  let connection = await DBManager.getConnectionAsync();
  try {
    const repository = connection.getRepository(RPLog);
    // シーズン内の記録を取得
    rpLogs = await repository.find({
      where: {
        season: season
      }
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
  return rpLogs;
}

export async function getBordersAsync(): Promise<Border[]> {
  let borders: Border[] = [];
  let connection = await DBManager.getConnectionAsync();
  try {
    const repository = connection.getRepository(Border);
    // 現在のボーダーを取得
    borders = await repository.find({
      where: {
        platform: In(Object.keys(platforms))
      }
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
  return borders;
}
