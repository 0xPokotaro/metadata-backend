import compression from 'compression'
import express from 'express'
import schedule from 'node-schedule'
import metadataRoutes from './routes/metadata.route'
import nftRoutes from './routes/nft.route'
import projectRoutes from './routes/project.route'
import { main as handlerSaveNftTokenAddresses } from './batch/jobs/saveNftTokenAddresses'

const app = express()
const port = 3001

app.use(compression())
app.use(express.json())

// API Routes
// app.use('/api/metadata', metadataRoutes)
// app.use('/api/nft', nftRoutes)
// app.use('/api/project', projectRoutes)

// Schedule
schedule.scheduleJob('* */10 * * * *', handlerSaveNftTokenAddresses)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
