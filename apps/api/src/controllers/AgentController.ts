import { Request, Response } from 'express'
import { agentService } from '../services/AgentService'

export class AgentController {

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const agents = await agentService.getAll()
      res.json(agents)
    } catch (e) {
      res.status(500).json({ message: (e as Error).message }) // 서버 내부 오류
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const agent = await agentService.getById(req.params.id) // URL의 :id 추출
      res.json(agent)
    } catch (e) {
      res.status(404).json({ message: (e as Error).message }) // 못찾으면 404
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const agent = await agentService.create(req.body) // 요청 body를 그대로 service에 넘김
      res.status(201).json(agent) // 생성 성공은 200이 아니라 201
    } catch (e) {
      res.status(400).json({ message: (e as Error).message }) // 잘못된 요청
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const agent = await agentService.update(req.params.id, req.body)
      res.json(agent)
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await agentService.delete(req.params.id)
      res.status(204).send() // 삭제 성공은 본문 없이 204
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }

  async heartbeat(req: Request, res: Response): Promise<void> {
    try {
      // Agent가 살아있음을 알리는 신호. status를 ONLINE으로 바꾸고 lastSeenAt 갱신
      const agent = await agentService.heartbeat(req.params.id)
      res.json(agent)
    } catch (e) {
      res.status(400).json({ message: (e as Error).message })
    }
  }
}

export const agentController = new AgentController()