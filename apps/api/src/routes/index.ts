import { Router } from 'express'
import { agentController } from '../controllers/AgentController'
import { replicationJobController } from '../controllers/ReplicationJobController'
import { eventLogController } from '../controllers/EventLogController'

const router = Router()

// Agents
//전체 목록 조회
router.get('/agents', (req, res) => agentController.getAll(req, res))

//id에 일치하는 Agent 조회
router.get('/agents/:id', (req, res) => agentController.getById(req, res))

//Agent 등록
router.post('/agents', (req, res) => agentController.create(req, res))

//Agent 정보 수정 
router.patch('/agents/:id', (req, res) => agentController.update(req, res))

//Agent 삭제
router.delete('/agents/:id', (req, res) => agentController.delete(req, res))

//Agent 상태 표시 
router.post('/agents/:id/heartbeat', (req, res) => agentController.heartbeat(req, res))


// Jobs
//전체 Job 목록 조회
router.get('/jobs', (req, res) => replicationJobController.getAll(req, res))

//id에 일치하는 Job 조회 
router.get('/jobs/:id', (req, res) => replicationJobController.getById(req, res))

//Job 정보 생성
router.post('/jobs', (req, res) => replicationJobController.create(req, res))

// Job 정보 수정 
router.patch('/jobs/:id', (req, res) => replicationJobController.update(req, res))

// Job 정보 삭제
router.delete('/jobs/:id', (req, res) => replicationJobController.delete(req, res))

// Job 실행
router.post('/jobs/:id/start', (req, res) => replicationJobController.start(req, res))

// Job 일시정지 
router.post('/jobs/:id/pause', (req, res) => replicationJobController.pause(req, res))

// Logs
// 로그 전체 목록 조회
router.get('/logs', (req, res) => eventLogController.getAll(req, res))

// id에 일치하는 로그 조회
router.get('/logs/:id', (req, res) => eventLogController.getById(req, res))

//로그 생성 
router.post('/logs', (req, res) => eventLogController.create(req, res))

export default router