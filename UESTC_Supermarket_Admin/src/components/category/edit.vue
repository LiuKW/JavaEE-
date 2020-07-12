<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categoryChart' }">可视化分类</el-breadcrumb-item>
      <el-breadcrumb-item>修改分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <div class="filter-container">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >新增</el-button>
      </div>

      <!-- v-loading="listLoading" -->
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="{row}">
            <span>{{ row.catId }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="分类名称">
          <template slot-scope="{row}">
            <span>{{ row.catName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="该分类的商品数">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.catGoodcount" size="small" class="edit-input" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >cancel</el-button>
            </template>
            <span v-else>{{ row.catGoodcount }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="修改时间">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >Ok</el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >Edit</el-button>
            <el-popconfirm
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？"
              @onConfirm="deleteData(row)"
            >
              <el-button
                style="margin-left: 10px;"
                slot="reference"
                type="danger"
                size="small"
                icon="el-icon-delete"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增分类" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="120px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="分类名称" prop="catName">
            <el-input v-model="temp.catName" />
          </el-form-item>
          <el-form-item label="分类商品数" prop="catGoodCount">
            <el-input v-model="temp.catGoodCount" disabled />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createData()">新增</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { fetchList, add, edit, del } from '@/api/category'
export default {
  data() {
    return {
      list: null,
      // listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      temp: {
        catName: '',
        catGoodCount: 0
      },
      rules: {
        catName: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // fetchList()
      //   .then(response => {
      //     console.log('getList', response)
      //   })
      //   .catch(() => {})

      // this.listLoading = true
      fetchList()
        .then(({ data }) => {
          console.log('getList()', data)
          // this.list = data;
          this.list = data.categories.map(v => {
            this.$set(v, 'edit', false)
            v.originalCount = v.catGoodcount //  will be used when user click the cancel botton
            return v
          })
          // this.listLoading = false
        })
        .catch(() => {
          console.log('getList() GG')
        })
    },
    cancelEdit(row) {
      row.catGoodcount = row.originalCount
      row.edit = false
      this.$message({
        message: '该分类数量已经被还原回旧值',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalCount = row.catGoodcount
      // 发请求更新数据库
      // console.log("当前行的数据", row);
      edit(row)
        .then(response => {
          console.log('createData', response)
          this.getList()
          this.$message({
            message: '该分类数量已经被修改成功',
            type: 'success'
          })
        })
        .catch(() => {})
    },
    resetTemp() {
      this.temp.catName = ''
      this.temp.catGoodCount = 0
    },
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
    },
    createData() {
      this.dialogFormVisible = false
      add(this.temp)
        .then(response => {
          // console.log("createData", response);
          this.getList()
          this.$message({
            message: '新增分类成功',
            type: 'success'
          })
        })
        .catch(() => {
          console.log('createData() GG')
        })
    },
    deleteData(row) {
      del([row.catId])
        .then(response => {
          this.getList()
          this.$message({
            message: '删除分类成功',
            type: 'success'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.filter-container {
  padding-bottom: 10px;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}

.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
