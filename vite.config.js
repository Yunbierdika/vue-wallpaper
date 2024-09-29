import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      // 打包时配置文件不进行压缩处理
      targets: [
        { src: 'src/project.json', dest: '' },
        { src: 'src/configuration.json5', dest: '' }
      ]
    })
  ],
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: '.', // 资源文件目录
    rollupOptions: {
      input: 'index.html' // 入口文件
    }
  },
  base: './', // 设置公共路径
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
