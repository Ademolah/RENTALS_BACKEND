import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validation/auth.validation.js';

const router = Router();

// Endpoint: POST /api/v1/auth/register
// We inject the validation middleware BEFORE the controller executes
router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);
router.post('/register-agent', authController.registerInvitedAgent)


export default router;