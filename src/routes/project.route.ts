import { Router } from 'express'
import * as projectController from '../controllers/project.controller'

const router = Router()

// router.get('/', metadataController.store)
// router.get('/:id', metadataController.store)
router.post('/', projectController.store)
// router.put('/:id', metadataController.store)

export default router
