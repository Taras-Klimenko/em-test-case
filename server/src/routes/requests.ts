import { Router } from 'express';
import {
  createRequest,
  startRequest,
  completeRequest,
  cancelRequest,
  getRequests,
  cancelAllRequestsInProgress,
  getRequestById,
} from '../controllers/requestController';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const newRequest = await createRequest(req.body);
    res.status(201).json(newRequest);
  } catch (error: any) {
    res.status(400).json({ error: error });
  }
});

router.patch('/:id/start', async (req, res) => {
  try {
    const updatedRequest = await startRequest(req.params.id);
    res.json(updatedRequest);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const updatedRequest = await completeRequest(req.params.id, req.body);
    res.json(updatedRequest);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
});

router.patch('/:id/cancel', async (req, res) => {
  try {
    const updatedRequest = await cancelRequest(req.params.id, req.body);
    res.json(updatedRequest);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await getRequests(req.query);
    res.json(requests);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await getRequestById(req.params.id);
    res.json(request);
  } catch (error: any) {
    res.status(404).json({ error: error.message || error });
  }
});

router.post('/cancel-all-in-progress', async (req, res) => {
  try {
    const result = await cancelAllRequestsInProgress(req.body);
    res.json({
      message: `Отменено ${result.count} обращений в статусе "В РАБОТЕ"`,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
});

export default router;
