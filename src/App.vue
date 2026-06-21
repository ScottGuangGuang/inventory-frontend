<template>
  <div style="padding: 20px;">
    <h2>库存管理系统 - 商品管理</h2>

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
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      searchKeyword: '',
      dialogVisible: false
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
            keyword: this.searchKeyword,
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
      alert('编辑功能待实现，ID: ' + row.id)
    },
    handleDelete(id) {
      if (confirm('确认删除该商品吗？')) {
        // TODO: 调用删除接口
        alert('删除功能待实现，ID: ' + id)
      }
    }
  }
}
</script>