<template>
  <Login v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
  <Products v-else />
</template>

<script>
import Login from './views/Login.vue'
import Products from './views/Products.vue'

export default {
  name: 'App',
  components: { Login, Products },
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('token')
    }
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      this.isLoggedIn = false
    }
  }
}
</script>