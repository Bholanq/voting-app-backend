// C:\..._votingapp\backend\routes\pollRoutes.js (Suggested Fix)
import express from 'express';
import {
  createPoll,
  updatePoll,
  deletePoll,
  getAllPolls,
  votePoll,
} from '../controllers/pollController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only admins can create, update, or delete polls
router.post('/', verifyToken(['admin']), createPoll);
router.put('/:id', verifyToken(['admin']), updatePoll);
router.delete('/:id', verifyToken(['admin']), deletePoll);

// Both admins and voters can view polls
router.get('/', verifyToken(['admin', 'voter']), getAllPolls);

// Only voters can vote
router.post('/vote', verifyToken(['voter']), votePoll);

export default router;