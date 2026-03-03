import { useEffect, useState } from 'react'
import { agentApi } from '@/api/agent'

export default function Agents() {
  const [agents, setAgents] = useState<any[]>([])
  const [name, setName] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [version, setVersion] = useState('')

  // Agent 목록 불러오기
  const fetchAgents = () => {
    agentApi.getAll().then(res => setAgents(res.data))
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  // Agent 등록
  const handleCreate = () => {
    if (!name) return
    agentApi.create({ name, ipAddress, version }).then(() => {
      setName('')
      setIpAddress('')
      setVersion('')
      fetchAgents() // 등록 후 목록 새로고침
    })
  }

  // Agent 삭제
  const handleDelete = (id: string) => {
    agentApi.delete(id).then(() => fetchAgents())
  }

  // Heartbeat
  const handleHeartbeat = (id: string) => {
    agentApi.heartbeat(id).then(() => fetchAgents())
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Agents</h1>

      {/* 등록 폼 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Register Agent</h2>
        <div className="flex gap-4">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded px-3 py-2 flex-1" placeholder="IP Address" value={ipAddress} onChange={e => setIpAddress(e.target.value)} />
          <input className="border rounded px-3 py-2 flex-1" placeholder="Version" value={version} onChange={e => setVersion(e.target.value)} />
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={handleCreate}>
            Register
          </button>
        </div>
      </div>

      {/* Agent 목록 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agent List</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">IP Address</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Version</th>
              <th className="pb-2">Last Seen</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id} className="border-b last:border-0">
                <td className="py-2">{agent.name}</td>
                <td className="py-2">{agent.ipAddress ?? '-'}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {agent.status}
                  </span>
                </td>
                <td className="py-2">{agent.version ?? '-'}</td>
                <td className="py-2">{agent.lastSeenAt ? new Date(agent.lastSeenAt).toLocaleString() : '-'}</td>
                <td className="py-2 flex gap-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600" onClick={() => handleHeartbeat(agent.id)}>
                    Heartbeat
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600" onClick={() => handleDelete(agent.id)}>
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