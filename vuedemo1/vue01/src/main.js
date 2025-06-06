import { createApp } from 'vue'; // 从 'vue' 导入 createApp (Vue 3)
import App from './App.vue'; // 导入根组件 App.vue

// Vue CLI 创建的项目可能已经导入了一些默认样式或其他配置
// 如果有 'import './assets/base.css';' 或类似的，你可以保留
// 如果你的项目需要全局样式，确保导入它
// import './style.css'; // 如果你有自定义的全局样式文件 style.css

// 创建 Vue 3 应用实例
const app = createApp(App);

// 如果你的项目创建时包含了 vue-router 或 vuex，你需要在这里导入并 use()
// 例如：
// import router from './router'; // 导入路由
// import store from './store';   // 导入 Vuex store
// app.use(router);
// app.use(store);


// 将应用挂载到 index.html 中的 id 为 'app' 的元素上
app.mount('#app');

console.log('Vue 3 application mounted!'); // 可选：验证应用是否启动
