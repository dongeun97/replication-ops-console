import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { AppDataSource } from './config/database'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'replication-manager-api' })
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

AppDataSource.initialize()
  .then(() => {
    console.log('? DB 연결 성공')
    app.listen(PORT, () => {
      console.log(`? API running: http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('? DB 연결 실패:', error)
    process.exit(1)
  })