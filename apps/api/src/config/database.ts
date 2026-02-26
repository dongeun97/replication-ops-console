import { DataSource } from 'typeorm'
import { Agent } from '../entities/Agent'
import { ReplicationJob } from '../entities/ReplicationJob'
import { EventLog } from '../entities/EventLog'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './dev.db',
  synchronize: true,
  logging: true,
  entities: [Agent, ReplicationJob, EventLog],
})