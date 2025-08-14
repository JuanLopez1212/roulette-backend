import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.mjs";
import { adjustBalance, deposit, getProfile, listUsers } from "../controllers/user.controller.mjs";
import { requireRole } from "../middlewares/role.middleware.mjs";


const router = Router()

router.get( '/api/profile', authMiddleware, getProfile )
router.patch( '/api/deposit', authMiddleware, deposit )

// Admin routes
router.get( '/api/users', authMiddleware, requireRole('admin'), listUsers )
router.patch( '/api/:userId/adjust-balance', authMiddleware, requireRole( 'admin' ), adjustBalance )

export default router 