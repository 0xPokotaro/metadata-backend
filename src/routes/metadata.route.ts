import { Router } from 'express'
import * as metadataController from '../controllers/metadata.controller'

const router = Router()

// router.get('/', metadataController.store)
// router.get('/:id', metadataController.store)
router.post('/', metadataController.store)
// router.put('/:id', metadataController.store)

export default router
