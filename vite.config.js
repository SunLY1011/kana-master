import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 部署到 GitHub Pages 时需要配置 base
// 请将 '/kana-master/' 替换为你的 GitHub 仓库名称
// 例如：仓库名为 "my-repo"，则改为 base: '/my-repo/'
// 如果仓库名为 username.github.io，则改为 base: '/'
export default defineConfig({
  base: '/kana-master/',
  plugins: [vue()],
  server: {
    port: 5173
  }
})