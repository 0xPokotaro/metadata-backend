import compression from 'compression'
import express from 'express'
import schedule from 'node-schedule'
import { main as handlerSaveNftTokenAddresses } from './batch/jobs/evmChain/saveNftTokenAddresses'
import { main as handlerSaveNftCollection } from './batch/jobs/evmChain/saveNftCollection'

const app = express()
const port = process.env.PORT || 8081

app.use(compression())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Schedule
schedule.scheduleJob('* */10 * * * *', handlerSaveNftTokenAddresses)
schedule.scheduleJob('* */20 * * * *', handlerSaveNftCollection)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
