import { useEffect, useState } from 'react'
import { jobApi } from '@/api/job'
import { agentApi } from '@/api/agent'

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [name, setName] = useState('')
  const [mode, setMode] = useState('FILE')
  const [sourcePath, setSourcePath] = useState('')
  const [targetPath, setTargetPath] = useState('')
  const [agentId, setAgentId] = useState('')

  const fetchJobs = () => jobApi.getAll().then(res => setJobs(res.data))

  useEffect(() => {
    fetchJobs()
    agentApi.getAll().then(res => setAgents(res.data))
  }, [])

  const handleCreate = () => {
    if (!name || !sourcePath || !targetPath) return
    jobApi.create({ name, mode, sourcePath, targetPath, agentId: agentId || undefined })
      .then(() => {
        setName(''); setSourcePath(''); setTargetPath(''); setAgentId('')
        fetchJobs()
      })
  }

  // Job 삭제
  const handleDelete = (id: string) => jobApi.delete(id).then(() => fetchJobs())
  // Job 시작
  const handleStart = (id: string) => jobApi.start(id).then(() => fetchJobs())
  // Job 일시정지
  const handlePause = (id: string) => jobApi.pause(id).then(() => fetchJobs())

  const statusColor: Record<string, string> = {
    READY: 'bg-gray-100 text-gray-600',
    RUNNING: 'bg-blue-100 text-blue-700',
    PAUSED: 'bg-yellow-100 text-yellow-700',
    SUCCESS: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Jobs</h1>

      {/* 생성 폼 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Create Job</h2>
        <div className="grid grid-cols-2 gap-4">
          <input className="border rounded px-3 py-2" placeholder="Job Name" value={name} onChange={e => setName(e.target.value)} />
          <select className="border rounded px-3 py-2" value={mode} onChange={e => setMode(e.target.value)}>
            <option value="FILE">FILE</option>
            <option value="BLOCK">BLOCK</option>
          </select>
          <input className="border rounded px-3 py-2" placeholder="Source Path" value={sourcePath} onChange={e => setSourcePath(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Target Path" value={targetPath} onChange={e => setTargetPath(e.target.value)} />
          <select className="border rounded px-3 py-2" value={agentId} onChange={e => setAgentId(e.target.value)}>
            <option value="">Select Agent (optional)</option>
            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>

      {/* Job 목록 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Job List</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Mode</th>
              <th className="pb-2">Source</th>
              <th className="pb-2">Target</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Agent</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="border-b last:border-0">
                <td className="py-2">{job.name}</td>
                <td className="py-2">{job.mode}</td>
                <td className="py-2">{job.sourcePath}</td>
                <td className="py-2">{job.targetPath}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[job.status]}`}>
                    {job.status}
                  </span>
                </td>
                <td className="py-2">{job.agent?.name ?? '-'}</td>
                <td className="py-2 flex gap-2">
                  {job.status !== 'RUNNING' && (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600" onClick={() => handleStart(job.id)}>
                      Start
                    </button>
                  )}
                  {job.status === 'RUNNING' && (
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600" onClick={() => handlePause(job.id)}>
                      Pause
                    </button>
                  )}
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600" onClick={() => handleDelete(job.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}