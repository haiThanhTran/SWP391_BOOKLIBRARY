import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "~", replacement: "/src" }
    ]
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/, // Cấu hình này để bao gồm các tệp .jsx
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // Tuỳ chọn: Cấu hình kiểu đặt tên class
    },
  },
})
