import { Request, Response } from 'express'
import { replicationJobService } from '../services/ReplicationJobService'

export class ReplicationJobController {

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const jobs = await replicationJobService.getAll()
      res.json(jobs)
    } catch (e) {
      res.status(500).json({ message: (e as Error).message })
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const job = await replicationJobService.getById(req.params.id) // URL의 :id 추출
      res.json(job)
    } catch (e) {
      res.status(404).json({ message: (e as Error).message }) // 못찾으면 404
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const job = await replicationJobService.create(req.body) // 요청 body를 service에 넘김
      res.status(201).json(job) // 생성 성공은 201
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const job = await replicationJobService.update(req.params.id, req.body)
      res.json(job)
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await replicationJobService.delete(req.params.id)
      res.status(204).send() // 삭제 성공은 본문 없이 204
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }

  async start(req: Request, res: Response): Promise<void> {
    try {
      // Job 상태를 READY/PAUSED → RUNNING 으로 변경
      const job = await replicationJobService.start(req.params.id)
      res.json(job)
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }

  async pause(req: Request, res: Response): Promise<void> {
    try {
      // Job 상태를 RUNNING → PAUSED 로 변경
      const job = await replicationJobService.pause(req.params.id)
      res.json(job)
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }
}

export const replicationJobController = new ReplicationJobController()