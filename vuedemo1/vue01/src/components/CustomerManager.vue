<template>
  <div class="customer-manager">
    <h2>客户管理</h2>

    <div v-if="showForm" class="form-container">
      <h3>{{ isEditing ? '编辑客户' : '添加新客户' }}</h3>
      <form @submit.prevent="saveCustomer">
        <div class="form-group">
          <label for="name">姓名:</label>
          <input type="text" id="name" v-model="currentCustomer.name" required>
        </div>
        <div class="form-group">
          <label for="email">邮箱:</label>
          <input type="email" id="email" v-model="currentCustomer.email" required>
        </div>
        <div class="form-group">
          <label for="phone">电话:</label>
          <input type="tel" id="phone" v-model="currentCustomer.phone">
        </div>
        <div class="form-actions">
          <button type="submit">{{ isEditing ? '更新' : '添加' }}</button>
          <button type="button" @click="cancelEdit">取消</button>
        </div>
      </form>
    </div>

    <div v-else class="list-container">
      <button @click="addCustomer" class="add-button">添加客户</button>

      <!-- 搜索区域 -->
      <div class="search-container">
        <label for="searchTerm">搜索客户:</label>
        <input
          type="text"
          id="searchTerm"
          v-model="searchTerm"
          placeholder="输入姓名、邮箱或电话搜索"
        >
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- 这里遍历的是 filteredCustomers，而不是 customers -->
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="5" style="text-align: center;">
              <!-- 根据是否有搜索词显示不同提示 -->
              {{ searchTerm ? '没有找到匹配的客户。' : '暂无客户数据' }}
            </td>
          </tr>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>{{ customer.id }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td class="actions">
              <button @click="editCustomer(customer)">编辑</button>
              <button @click="deleteCustomer(customer.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// 从 'vue' 导入 ref, reactive, computed (Vue 3 Composition API)
import { ref, reactive, computed } from 'vue';

// 客户数据列表 (ID 1, 2, 3, 4 已经是整数)
const customers = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13812345678' },
  { id: 2, name: '李四', email: 'lisi@example.com', phone: '13987654321' },
  { id: 3, name: '王五', email: 'wangwu@test.com', phone: '13000000000' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', phone: '13111111111' },
]);

// 控制表单显示/隐藏
const showForm = ref(false);
// 控制当前是添加还是编辑状态
const isEditing = ref(false);
// 当前正在编辑或添加的客户数据对象
const currentCustomer = reactive({
  id: null,
  name: '',
  email: '',
  phone: '',
});

// 搜索关键词
const searchTerm = ref('');

// 计算属性，根据搜索关键词过滤客户列表
const filteredCustomers = computed(() => {
  if (!searchTerm.value) {
    return customers.value;
  }

  const lowerSearchTerm = searchTerm.value.toLowerCase();

  return customers.value.filter(customer => {
    return customer.name.toLowerCase().includes(lowerSearchTerm) ||
           customer.email.toLowerCase().includes(lowerSearchTerm) ||
           (customer.phone && customer.phone.toString().includes(lowerSearchTerm));
  });
});


// --- 增 (Create) ---
const addCustomer = () => {
  Object.assign(currentCustomer, {
    id: null, 
    name: '',
    email: '',
    phone: '',
  });
  isEditing.value = false;
  showForm.value = true;
};

// --- 改 (Update) ---
const editCustomer = (customer) => {
  // 编辑时将现有客户数据赋值给 currentCustomer
  Object.assign(currentCustomer, customer);
  isEditing.value = true;
  showForm.value = true;
};

// 保存客户 (用于添加和更新)
const saveCustomer = () => {
  if (isEditing.value) {
    // 更新现有客户逻辑不变
    const index = customers.value.findIndex(cust => cust.id === currentCustomer.id);
    if (index !== -1) {
      Object.assign(customers.value[index], currentCustomer);
    }
  } else {
    // --- 修改点：生成新的顺序 ID ---

    // 1. 找到当前所有客户中最大的 ID
    // 如果 customers 数组为空，Math.max() 会返回 -Infinity。为了确保第一个 ID 是 1，
    // 我们使用 Math.max(0, ...) 来保证最小值是 0。
    const maxId = Math.max(0, ...customers.value.map(c => c.id));

    // 2. 新 ID 为最大 ID + 1
    const newId = maxId + 1;

    // 3. 将新客户对象添加到数组，使用新生成的顺序 ID
    customers.value.push({ ...currentCustomer, id: newId });

    // --- 修改点结束 ---
  }

  // 保存或添加成功后隐藏表单并重置 currentCustomer
  showForm.value = false;
  Object.assign(currentCustomer, {
    id: null,
    name: '',
    email: '',
    phone: '',
  });
};

// 取消编辑/添加
const cancelEdit = () => {
  showForm.value = false;
  Object.assign(currentCustomer, {
    id: null,
    name: '',
    email: '',
    phone: '',
  });
};

// --- 删 (Delete) ---
const deleteCustomer = (customerId) => {
  if (confirm(`确定要删除 ID 为 ${customerId} 的客户吗？`)) {
    customers.value = customers.value.filter(customer => customer.id !== customerId);
  }
};

// --- 查 (Read & Query) ---
// 客户列表的显示现在依赖于 filteredCustomers 计算属性 (实现读取和筛选)
// 搜索关键词通过 searchTerm 响应式变量与输入框双向绑定
// filteredCustomers 根据 searchTerm 的变化自动更新，驱动视图刷新

</script>

<style scoped>
/* 这里是 CustomerManager 组件特有的样式 */
.customer-manager {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.form-container {
  background-color: #eef;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
  border: 1px solid #ccf;
}

.form-container h3 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: #555;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  margin-left: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.form-actions button:active {
  opacity: 0.8;
}

.form-actions button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background-color: #45a049;
}

.form-actions button[type="button"] {
  background-color: #f44336;
  color: white;
}

.form-actions button[type="button"]:hover {
  background-color: #d32f2f;
}

.list-container {
  margin-top: 30px;
}

.add-button {
  display: block;
  margin: 0 auto 20px auto;
  padding: 12px 25px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.add-button:hover {
  background-color: #0b7dda;
}
.add-button:active {
  opacity: 0.8;
}

/* 搜索区域样式 */
.search-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.search-container label {
    margin-right: 10px;
    font-weight: bold;
    color: #555;
}

.search-container input {
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    box-sizing: border-box;
}


table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

table th, table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  word-break: break-all;
}

table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

table tr:nth-child(even) {
  background-color: #f9f9f9;
}

table tr:hover {
    background-color: #e9e9e9;
}

.actions button {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.actions button:last-child {
    margin-right: 0;
}

.actions button:active {
  opacity: 0.8;
}

.actions button:first-child {
  background-color: #ff9800;
  color: white;
}
.actions button:first-child:hover {
  background-color: #f57c00;
}

.actions button:last-child {
  background-color: #f44336;
  color: white;
}
.actions button:last-child:hover {
  background-color: #d32f2f;
}
</style>
