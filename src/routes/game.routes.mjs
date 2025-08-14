import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.mjs"
import { requireRole } from "../middlewares/role.middleware.mjs"
import { closeAndSpinGame, createGame, getGame, listGames, openGame } from "../controllers/game.controller.mjs"


const router = Router()

// Listar todas las ruletas (Público)
router.get( '/api/games', listGames )
router.get( '/api/games/:id', getGame )

// Admin: Crear una nueva ruleta, abrir una ruleta, cerrar una ruleta
router.post( '/api/games/create', authMiddleware, requireRole( 'admin' ), createGame )
router.patch( '/api/games/:id/open', authMiddleware, requireRole( 'admin' ), openGame )
router.patch( '/api/games/:id/close', authMiddleware, requireRole( 'admin' ), closeAndSpinGame )

export default router