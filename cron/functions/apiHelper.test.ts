import * as helper from './apiHelper';
import platforms from '../../common/platforms.json';

describe('apiHelperTest', () => {
  test('fetchBordersAsyncTest', async () => {
    const result = await helper.fetchBordersAsync();
    expect(result.length).toBe(Object.keys(platforms).length);
  }, 30000);
  test('fetchRPRankingsAsyncTest', async () => {
    const result = await helper.fetchRPRankingsAsync();
    expect(result.season).toBe(process.env.SEASON);
    expect(result.origin.length).toBe(Number(process.env.BORDER));
    expect(result.ps.length).toBe(Number(process.env.BORDER));
    expect(result.xbox.length).toBe(Number(process.env.BORDER));
    expect(result.valid).toBe(true);
  }, 30000);
});
