import 'reflect-metadata' // TypeORM 데코레이터 동작에 필요. 반드시 가장 먼저 import
import express from 'express'
import cors from 'cors'
import router from './routes'

const app = express()

app.use(cors())
app.use(express.json()) // 없으면 req.body가 undefined. JSON 파싱용
app.use('/api/v1', router)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'replication-manager-api' })
})

export default app