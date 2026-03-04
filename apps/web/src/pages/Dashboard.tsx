import { useEffect, useState } from 'react'
import { agentApi } from '@/api/agent'
import { jobApi } from '@/api/job'

export default function Dashboard() {
  const [agents, setAgents] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    // 컴포넌트 마운트시 Agent, Job 목록 가져옴
    agentApi.getAll().then(res => setAgents(res.data))
    jobApi.getAll().then(res => setJobs(res.data))
  }, [])

  const onlineAgents = agents.filter(a => a.status === 'ONLINE').length
  const runningJobs = jobs.filter(j => j.status === 'RUNNING').length
  const errorJobs = jobs.filter(j => j.status === 'FAILED').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Agents</p>
          <p className="text-3xl font-bold text-blue-600">{agents.length}</p>
          <p className="text-sm text-green-500 mt-1">Online: {onlineAgents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Jobs</p>
          <p className="text-3xl font-bold text-yellow-500">{jobs.length}</p>
          <p className="text-sm text-blue-500 mt-1">Running: {runningJobs}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Failed Jobs</p>
          <p className="text-3xl font-bold text-red-500">{errorJobs}</p>
          <p className="text-sm text-gray-400 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Agent 목록 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agent Status</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">IP Address</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Version</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id} className="border-b last:border-0">
                <td className="py-2">{agent.name}</td>
                <td className="py-2">{agent.ipAddress}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {agent.status}
                  </span>
                </td>
                <td className="py-2">{agent.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}