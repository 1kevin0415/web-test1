<template>
  <div id="app-container">
    <!-- 你的应用可以在这里有其他布局元素 -->
    <!-- 比如导航栏、侧边栏等 -->

    <!-- 使用客户管理组件 -->
    <CustomerManager />

    <!-- 应用的其他部分 -->
  </div>
</template>

<script setup>
import CustomerManager from './components/CustomerManager.vue'; // 导入客户管理组件

// 如果 App.vue 需要自己的响应式数据、计算属性、方法等，可以在这里使用 Composition API 语法
// 例如：
// import { ref } from 'vue';
// const message = ref('Hello Vue 3!');
// function greet() {
//   alert(message.value);
// }

</script>

<style>
/* 这里可以放一些全局的或者 App.vue 特有的样式 */
/* 注意：这里的 style 没有 scoped 属性，所以样式是全局的 */
#app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* 如果需要，可以在这里添加 body, html 的全局样式 */
body {
  margin: 0;
  background-color: #f4f4f4;
}
</style>
