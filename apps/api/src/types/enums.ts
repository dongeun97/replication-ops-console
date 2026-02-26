// Agent 상태
export enum AgentStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
  }
  
  // 복제 Job 상태
  export enum JobStatus {
    READY = 'READY',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    PAUSED = 'PAUSED',
  }
  
  // 복제 방식
  export enum ReplicationMode {
    FILE = 'FILE',
    BLOCK = 'BLOCK',
  }
  
  // 이벤트 로그 레벨
  export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
  }