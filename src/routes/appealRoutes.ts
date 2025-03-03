import { Router } from 'express';
import {
  createAppeal,
  takeAppealInProgress,
  completeAppeal,
  cancelAppeal,
  getAppeals,
  cancelAllInProgress,
} from '../controllers/appealController';

const router = Router();

router.post('/appeals', createAppeal);
router.patch('/appeals/:id/in-progress', takeAppealInProgress);
router.patch('/appeals/:id/complete', completeAppeal);
router.patch('/appeals/:id/cancel', cancelAppeal);
router.get('/appeals', getAppeals);
router.patch('/appeals/cancel-all-in-progress', cancelAllInProgress);

export default router;