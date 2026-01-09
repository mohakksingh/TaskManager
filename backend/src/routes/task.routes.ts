import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getTasks, createTask, getTaskById, updateTask, deleteTask, toggleTaskStatus } from '../controllers/task.controller';

const router = Router();

router.use(authenticateToken); // Protect all task routes

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id/toggle', toggleTaskStatus); // Specific route before generic /:id patch if generic exists, or just specific.
// Wait, PATCH /:id usually update fields. Toggle is specific. 
// Express matches in order.
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
