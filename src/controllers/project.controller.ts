import { Request, Response } from 'express'
import { ProjectService } from '../services/project.service'

export const store = (req: Request, res: Response) => {
  console.log(req.body)
  res.send('Hello World!')
}
