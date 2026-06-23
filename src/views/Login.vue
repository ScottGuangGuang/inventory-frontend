<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5;">
    <el-card style="width: 400px;">
      <template #header>
        <h2 style="text-align: center; margin: 0;">库存管理系统</h2>
      </template>
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin" :loading="loading">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        this.$message.warning('请输入用户名和密码')
        return
      }
      this.loading = true
      try {
        const res = await axios.post('/api/auth/login', this.loginForm)
        if (res.data.code === 200) {
          localStorage.setItem('token', res.data.data.token)
          localStorage.setItem('username', res.data.data.username)
          this.$message.success('登录成功')
          this.$emit('login-success')
        } else {
          this.$message.error(res.data.message || '登录失败')
        }
      } catch (error) {
        console.error('登录异常', error)
        this.$message.error('系统异常')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>