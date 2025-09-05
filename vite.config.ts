
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false, // 减少错误覆盖干扰
      timeout: 5000 // 减少超时时间
    },
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  },
  plugins: [
    react(), // 简化React插件配置
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 简化构建配置，移除可能导致失败的复杂配置
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        // 只忽略特定警告，减少构建干扰
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        warn(warning);
      }
    },
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'development'
  },
  // 简化依赖预构建，只包含必要的包
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ]
  },
  // 移除复杂的esbuild配置
  define: {
    __DEV__: mode === 'development'
  }
}));
