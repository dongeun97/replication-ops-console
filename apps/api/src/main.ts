import { AppDataSource } from './config/database'
import app from './app' // app.ts에서 라우터가 연결된 app을 가져옴

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