import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Apply API key authentication to all routes
router.use(apiKeyAuth);

// GET /api/users/search?name=searchTerm
router.get('/search', userController.searchUsers);

// POST /api/users/update
router.post('/update', userController.updateUsers);

export default router;
