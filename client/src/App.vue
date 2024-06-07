<!--
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-06-08 00:17:42
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-06-08 03:02:04
 * @FilePath: \passport-oauth2\client\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { login, callback } from './apis/auth'


const isShow = ref(false)
onMounted(() => {
  const token = localStorage.getItem('access_token');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code')
  if (!token) {
    if (!code) {
      login({
        redirect_uri: 'http://127.0.0.1:5173',
        // scope: 'read',
        // state: '123'
      })
    } else {
      callback({
        code: code,
        redirect_uri: 'http://127.0.0.1:5173',
        client_id: '00001',
        client_secret: '00001-1',
        grant_type: 'authorization_code'
      })
        .then(res => {
          console.log('res----', res);
          localStorage.setItem('access_token', res.access_token)
          isShow.value = true
        })
    }
  }
})
</script>

<template>
  <div v-if="isShow">
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
