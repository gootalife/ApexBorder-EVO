import cron from 'node-cron';
import moment from 'moment';
import { DBManager } from '../common/connections/dbManager';
import { RPLog } from '../common/entities/rpLog';
import * as scraping from './functions/scraping';
import { Border } from '../common/entities/border';

async function updateRPLogAsync(): Promise<boolean> {
  let isCompleted = false;
  const rpLog = await scraping.fetchRPRankingsAsync();
  let connection = await DBManager.getConnectionAsync();
  try {
    const repository = connection.getRepository(RPLog);
    await repository.insert(rpLog);
    isCompleted = true;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
  return isCompleted;
}

async function insertEmptyData(): Promise<boolean> {
  let isCompleted = false;
  let connection = await DBManager.getConnectionAsync();
  try {
    const repository = connection.getRepository(RPLog);
    await repository.insert(new RPLog(moment().format('YYYY-MM-DD HH:mm:ss'), process.env.SEASON));
    isCompleted = true;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
  return isCompleted;
}

async function updateBordersAsync(): Promise<boolean> {
  let isCompleted = false;
  const borders = await scraping.fetchBordersAsync();
  let connection = await DBManager.getConnectionAsync();
  try {
    const repository = connection.getRepository(Border);
    await repository.save(borders);
    isCompleted = true;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
  return isCompleted;
}

// 毎日0時
cron.schedule('0 0 0 * * *', async () => {
  try {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} --- Updating RPLog started. ---`);
    await updateRPLogAsync();
    console.log(`${moment().format('YYYY - MM - DD HH: mm: ss')} --- Updating RPLog was completed. ---`);
  } catch (e) {
    console.log(e);
    console.log(`${moment().format('YYYY - MM - DD HH: mm: ss')} *** Updating RPLog failed. ***`);
    await insertEmptyData();
    console.log(`${moment().format('YYYY - MM - DD HH: mm: ss')} Inserted empty data instead of invalid data.`);
  }
});

// 毎時15,45分
const task = cron.schedule('0 15,45 * * * *', async () => {
  console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} --- Updating borders started. ---`);
  try {
    await updateBordersAsync();
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} --- Updating borders was completed. ---`);
  } catch (e) {
    console.log(e);
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} *** Updating borders failed. ***`);
  }
});

task.start();
