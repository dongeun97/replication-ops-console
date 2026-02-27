import { Request, Response } from 'express'
import { eventLogService } from '../services/EventLogService'

export class EventLogController {

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      // ?limit=50 처럼 쿼리스트링으로 개수 제한 가능. 없으면 기본 100개
      const limit = req.query.limit ? Number(req.query.limit) : undefined
      const logs = await eventLogService.getAll(limit)
      res.json(logs)
    } catch (e) {
      res.status(500).json({ message: (e as Error).message })
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const log = await eventLogService.getById(req.params.id) // URL의 :id 추출
      res.json(log)
    } catch (e) {
      res.status(404).json({ message: (e as Error).message }) // 못찾으면 404
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const log = await eventLogService.create(req.body) // 요청 body를 service에 넘김
      res.status(201).json(log) // 생성 성공은 201
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }
}

export const eventLogController = new EventLogController()