import { Request, Response } from 'express'
import { MetadataService } from '../services/metadata.service'

export const store = (req: Request, res: Response) => {
  res.send('Hello World!')
}
