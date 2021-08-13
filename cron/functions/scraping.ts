import moment from 'moment';
import puppeteer from 'puppeteer';
import platforms from '../../common/platforms.json';
import { Border } from '../../common/entities/border';
import { RPLog } from '../../common/entities/rpLog';

const playersPerPage = 100;

async function fetchBorderAsync(plat: string): Promise<number> {
  let borderRp = -1;
  let browser;
  let window;
  try {
    const targetPage = Math.ceil(Number(process.env.BORDER) / playersPerPage);
    const url = `https://apex.tracker.gg/legacy/leaderboards/${plat}/RankScore?page=${targetPage}`;
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ]
    });
    window = await browser.newPage();
    await window.goto(url, {
      timeout: 60000
    });
    await window.waitForSelector('td.trn-lb-entry__stat.trn-text--right');
    const ranking: string = await window.evaluate(() => {
      const result: string[] = [];
      document.querySelectorAll('td.trn-lb-entry__stat.trn-text--right').forEach((elem, index) => {
        if (index % 2 === 0) {
          result.push(elem.textContent);
        }
      });
      return result;
    });
    if (ranking.length === playersPerPage) {
      borderRp = Number(ranking[49].trim().replace(',', ''));
    } else {
      throw new Error(`Request to ${url} failed.`);
    }
  } finally {
    if (window) {
      await window.close();
    }
    if (browser) {
      await browser.close();
    }
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
  let rpRanking: number[] = [];
  const count = Math.ceil(Number(border) / playersPerPage);
  let browser;
  let window;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ]
    });
    window = await browser.newPage();
    for (let pageNum = 1; pageNum <= count; pageNum++) {
      const url = `https://apex.tracker.gg/legacy/leaderboards/${plat}/RankScore?page=${pageNum}`;
      await window.goto(url, {
        timeout: 100000
      });
      await window.waitForSelector('td.trn-lb-entry__stat.trn-text--right');
      const ranking: number[] = await window.evaluate(() => {
        const result: number[] = [];
        document.querySelectorAll('td.trn-lb-entry__stat.trn-text--right').forEach((elem, index) => {
          if (index % 2 === 0) {
            result.push(Number(elem.textContent.trim().replace(',', '')));
          }
        });
        return result;
      });
      if (ranking.length !== playersPerPage) {
        throw new Error(`items.length(${ranking.length}) != ${playersPerPage}.`);
      }
      rpRanking = rpRanking.concat(ranking);
    }
    rpRanking = rpRanking.slice(0, border);
    console.log(`\r${plat}: ${count}/${count} ${rpRanking.length}/${border} done!\n`);
  } finally {
    if (window) {
      await window.close();
    }
    if (browser) {
      await browser.close();
    }
  }
  return rpRanking;
}

export async function fetchRPRankingsAsync(): Promise<RPLog> {
  const rpLog = new RPLog(moment().format('YYYY-MM-DD HH:mm:ss'), process.env.SEASON);
  const promises: Promise<number[]>[] = [];
  for (const plat of Object.keys(platforms)) {
    promises.push(fetchRPRankingAsync(platforms[plat]));
  }
  const results = await Promise.all(promises);
  for (const [index, plat] of Object.keys(platforms).entries()) {
    rpLog[plat] = results[index];
  }
  rpLog.valid = true;
  return rpLog;
}
