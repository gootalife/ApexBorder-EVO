import axios from 'axios';
import moment from 'moment';
import platforms from '../../common/platforms.json';
import { Border } from '../../common/entities/border';
import { RPLog } from '../../common/entities/rpLog';
import * as tracker from '../format/tracker';

const playersPerPage = 100;

async function fetchBorderAsync(plat: string): Promise<number> {
  let borderRp = -1;
  const border = Number(process.env.BORDER);
  const skip = border - 1;
  const url = `https://api.tracker.gg/api/v1/apex/standard/leaderboards?type=stats&platform=${plat}&board=RankScore&skip=${skip}&take=${playersPerPage}`;
  const res = await axios.get<tracker.Tracker>(url);
  if (res.status) {
    const data = res.data;
    borderRp = data.data.items[0].value;
  } else {
    throw new Error('Response was invalid.');
  }
  return borderRp;
}

export async function fetchBordersAsync(): Promise<Border[]> {
  const borders: Border[] = [];
  const promises: Promise<number>[] = [];
  for (const plat of Object.keys(platforms)) {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} ${plat}: start.`);
    promises.push(fetchBorderAsync(platforms[plat]));
  }
  const res = await Promise.all(promises);
  for (const [index, plat] of Object.keys(platforms).entries()) {
    const border = new Border(plat, moment().format('YYYY-MM-DD HH:mm:ss'), res[index]);
    borders.push(border);
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} ${plat}: done.`);
  }
  return borders;
}

async function fetchRPRankingAsync(plat: string): Promise<number[]> {
  const border = Number(process.env.BORDER);
  let ranking: number[] = [];
  const count = Math.ceil(Number(border) / playersPerPage);
  let skip = 0;
  for (let i = 0; i < count; i++) {
    const url = `https://api.tracker.gg/api/v1/apex/standard/leaderboards?type=stats&platform=${plat}&board=RankScore&skip=${skip}&take=${playersPerPage}`;
    const res = await axios.get<tracker.Tracker>(url);
    if (res.status) {
      const data = res.data;
      ranking = ranking.concat(data.data.items.map((x) => x.value));
    } else {
      throw new Error('Response was invalid.');
    }
    skip += playersPerPage;
  }
  ranking = ranking.slice(0, border);
  if (ranking.length !== border) {
    throw new Error(`Ranking length was invalid.`);
  }
  return ranking;
}

export async function fetchRPRankingsAsync(): Promise<RPLog> {
  const rpLog = new RPLog(moment().format('YYYY-MM-DD HH:mm:ss'), process.env.SEASON);
  const promises: Promise<number[]>[] = [];
  for (const plat of Object.keys(platforms)) {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} ${plat}: start.`);

    promises.push(fetchRPRankingAsync(platforms[plat]));
  }
  const results = await Promise.all(promises);
  for (const [index, plat] of Object.keys(platforms).entries()) {
    rpLog[plat] = results[index];
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} ${plat}: done.`);
  }
  rpLog.valid = true;
  return rpLog;
}
