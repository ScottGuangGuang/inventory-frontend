import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 请求拦截器（保留你原来的）
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// ⭐ 新增：响应拦截器（处理 token 过期）
axios.interceptors.response.use(
  response => {
    const res = response.data
    // 判断业务状态码 401 → token无效或过期
    if (res.code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.error(res.message || '登录已过期，请重新登录')
      // 刷新页面，App.vue 会检测到没有 token 自动显示登录页
      window.location.href = '/'
      return Promise.reject(new Error(res.message))
    }
    return response
  },
  error => {
    // HTTP 状态码 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.error('登录已过期，请重新登录')
      window.location.href = '/'
    } else {
      ElMessage.error(error.message || '网络请求失败')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')