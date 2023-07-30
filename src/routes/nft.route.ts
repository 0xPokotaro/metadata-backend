import { Router } from 'express'
import * as nftController from '../controllers/nft.controller'

const router = Router()

// router.get('/', metadataController.store)
// router.get('/:id', metadataController.store)
router.post('/register', nftController.register)
// router.put('/:id', metadataController.store)

export default router
