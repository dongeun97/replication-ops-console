import { test, expect } from '@playwright/test'

// 대시보드 화면 로드 테스트
test('Dashboard page loads correctly', async ({ page }) => {
  // 대시보드 접속
  await page.goto('http://localhost:5173')

  // 타이틀 확인
  await expect(page.getByText('Replication Ops Console')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

  // 카드 3개 확인
  await expect(page.getByText('Total Agents')).toBeVisible()
  await expect(page.getByText('Total Jobs')).toBeVisible()
  await expect(page.getByText('Failed Jobs')).toBeVisible()
})

// Agent 등록 및 삭제 테스트
test('Agent register and delete works correctly', async ({ page }) => {
  // Agents 페이지 접속
  await page.goto('http://localhost:5173/agents')

  // Agent 등록 폼 입력
  await page.getByPlaceholder('Name').fill('test-agent')
  await page.getByPlaceholder('IP Address').fill('192.168.1.99')
  await page.getByPlaceholder('Version').fill('1.0.0')

  // Register 버튼 클릭
  await page.getByRole('button', { name: 'Register' }).click()

  // 등록된 Agent 확인
  await expect(page.getByText('test-agent')).toBeVisible()

  // 삭제
  const row = page.getByRole('row', { name: /test-agent/ })
  await row.getByRole('button', { name: 'Delete' }).click()

  // 삭제 확인
  await expect(page.getByText('test-agent')).not.toBeVisible()
})