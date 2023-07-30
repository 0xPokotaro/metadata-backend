import compression from 'compression'
import express from 'express'
import metadataRoutes from './routes/metadata.route'
import nftRoutes from './routes/nft.route'
import projectRoutes from './routes/project.route'

const app = express()
const port = 3001

app.use(compression())
app.use(express.json())

app.use('/api/metadata', metadataRoutes)
app.use('/api/nft', nftRoutes)
app.use('/api/project', projectRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
