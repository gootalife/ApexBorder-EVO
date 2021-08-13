import * as db from './scraping';
import platforms from '../../common/platforms.json';

describe('dbFunctionTest', () => {
  test('fetchBordersAsyncTest', async () => {
    const result = await db.fetchBordersAsync();
    expect(result.length).toBe(Object.keys(platforms).length);
  });
  test('fetchRPRankingsAsyncTest', async () => {
    const result = await db.fetchRPRankingsAsync();
    expect(result.season).toBe(process.env.SEASON);
    expect(result.origin.length).toBe(Number(process.env.BORDER));
    expect(result.ps.length).toBe(Number(process.env.BORDER));
    expect(result.xbox.length).toBe(Number(process.env.BORDER));
  }, 100000);
});
