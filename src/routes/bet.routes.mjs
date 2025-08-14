import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.mjs"
import { listUserBets, placeBet } from "../controllers/bet.controller.mjs"


const router = Router()

// Hacer una apuesta en la ruleta ( requiere autenticación )
router.post( '/api/:rouletteId/bet', authMiddleware, placeBet )

// Listar apuestas de un usuario autenticado
router.get( '/api/bet/user', authMiddleware, listUserBets )

export default router