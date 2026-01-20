import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Electron에서 상대 경로로 리소스 로드
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true, // 포트 사용 중이면 에러 발생 (명확한 문제 파악용)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
