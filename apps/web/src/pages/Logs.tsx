import { useEffect, useState } from 'react'
import { logApi } from '@/api/log'

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    logApi.getAll().then(res => setLogs(res.data))
  }, [])

  const levelColor: Record<string, string> = {
    INFO: 'bg-blue-100 text-blue-700',
    WARN: 'bg-yellow-100 text-yellow-700',
    ERROR: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Logs</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Event Logs</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Level</th>
              <th className="pb-2">Message</th>
              <th className="pb-2">Agent</th>
              <th className="pb-2">Job</th>
              <th className="pb-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor[log.level]}`}>
                    {log.level}
                  </span>
                </td>
                <td className="py-2">{log.message}</td>
                <td className="py-2">{log.agent?.name ?? '-'}</td>
                <td className="py-2">{log.job?.name ?? '-'}</td>
                <td className="py-2">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}