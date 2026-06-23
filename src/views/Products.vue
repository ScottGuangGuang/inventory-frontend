<template>
  <div style="padding: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0;">库存管理系统 - 商品管理</h2>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>
    <!-- 搜索栏 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6">
        <el-input v-model="searchKeyword" placeholder="请输入商品名称" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-button type="success" @click="dialogVisible = true">新增商品</el-button>
      </el-col>
    </el-row>

    <!-- 商品表格 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="stock" label="库存" />
      <el-table-column prop="minStock" label="预警值" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增商品" width="500px" @close="resetForm">
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="form.price" :precision="2" :min="0" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="预警值">
          <el-input-number v-model="form.minStock" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="editForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="editForm.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="editForm.price" :precision="2" :min="0" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="editForm.stock" :min="0" />
        </el-form-item>
        <el-form-item label="预警值">
          <el-input-number v-model="editForm.minStock" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="fetchData"
      @current-change="fetchData"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Products',
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      searchKeyword: '',
      dialogVisible: false,
      form: {
        name: '',
        category: '',
        price: 0,
        stock: 0,
        minStock: 0
      },
      editDialogVisible: false,
      editForm: {
        id: null,
        name: '',
        category: '',
        price: 0,
        stock: 0,
        minStock: 0
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await axios.get('/api/products/page', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            keyword: this.searchKeyword
          }
        })
        if (res.data.code === 200) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      } catch (error) {
        console.error('加载数据失败', error)
      }
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    resetSearch() {
      this.searchKeyword = ''
      this.handleSearch()
    },
    handleEdit(row) {
      this.editDialogVisible = true
      this.editForm = {
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
        stock: row.stock,
        minStock: row.minStock
      }
    },
    async submitEdit() {
      try {
        const res = await axios.put(`/api/products/${this.editForm.id}`, this.editForm)
        if (res.data.code === 200) {
          this.$message.success('编辑成功')
          this.editDialogVisible = false
          this.fetchData()
        } else {
          this.$message.error(res.data.message || '编辑失败')
        }
      } catch (error) {
        console.error('编辑失败', error)
        this.$message.error('系统异常')
      }
    },
    async handleDelete(id) {
      if (!confirm('确认删除该商品吗？')) return
      try {
        const res = await axios.delete(`/api/products/${id}`)
        if (res.data.code === 200) {
          this.$message.success('删除成功')
          this.fetchData()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败', error)
        this.$message.error('系统异常')
      }
    },
    async submitForm() {
      try {
        const res = await axios.post('/api/products', this.form)
        if (res.data.code === 200) {
          this.$message.success('新增成功')
          this.dialogVisible = false
          this.resetForm()
          this.fetchData()
        } else {
          this.$message.error(res.data.message || '新增失败')
        }
      } catch (error) {
        console.error('新增失败', error)
        this.$message.error('系统异常')
      }
    },
    resetForm() {
      this.form = {
        name: '',
        category: '',
        price: 0,
        stock: 0,
        minStock: 0
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.reload()
    }
  }
}
</script>