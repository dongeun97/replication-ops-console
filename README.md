# Replication Ops Console

파일 및 블록 복제 작업을 관리하고 모니터링하는 웹 기반 복제 운영 콘솔

## 목표
- Replication Job 관리 (생성/조회/수정/중지)
- Agent 상태 모니터링 (heartbeat)
- 이벤트 로그 및 알람 처리

api: 백엔드 (Node.js + TypeScript)
web: 프론트 (React)


## 흐름
[복제 엔진 (OS 레벨)]
        ↑
   Agent 프로그램
        ↑
Node.js 서버 (관리 API)
        ↑
React 웹 콘솔

# 1. Manager Api 

Agent : 에이전트 등록/상태(online/offline), lastSeen

ReplicationJob : file/block 모드, 상태, source/target

EventLog : 작업/에이전트 관련 이벤트(알람/로그)

# 라이브러리
node_modules: 라이브러리 실제 파일 
package-lock.json: 설치 버전 기록 파일 
