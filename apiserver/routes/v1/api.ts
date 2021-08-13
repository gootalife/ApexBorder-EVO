import express from 'express';
import * as api from '../../logics/apiFunction';
const router = express.Router();

router.get('/rplogs/between/:start/:end', async (req: express.Request, res: express.Response) => {
  try {
    const start = req.params.start;
    const end = req.params.end;
    const rpLogs = await api.getRPLogsBetweenAsync(start, end);
    res.status(200);
    res.json(rpLogs);
  } catch (e) {
    res.status(500);
    res.json('{ "error": "Creating response was failed." }');
  }
});

router.get('/rplogs/season/:season', async (req: express.Request, res: express.Response) => {
  try {
    const season = req.params.season;
    const rpLogs = await api.getRPLogsOnSeasonAsync(season);
    res.status(200);
    res.json(rpLogs);
  } catch (e) {
    res.status(500);
    res.json('{ "error": "Creating response was failed." }');
  }
});

router.get('/borders', async (req: express.Request, res: express.Response) => {
  try {
    const currentBoders = await api.getBordersAsync();
    res.status(200);
    res.json(currentBoders);
  } catch (e) {
    res.status(500);
    res.json('{ "error": "Creating response was failed." }');
  }
});

export default router;
