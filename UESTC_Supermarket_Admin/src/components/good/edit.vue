<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goodAdd' }">新增商品</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="handleSearch()">
        <el-form-item>
          <!-- value值是有些事件用到，而label值就是名字，所以操作的话，value给catId比较好 -->
          <el-select
            v-model="categoryType"
            placeholder="选择分类类别"
            filterable
            @focus="getLatestOptions"
            :loading="optionsLoading"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.catId"
              :label="item.catName"
              :value="item.catId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.content" placeholder="模糊查询的内容" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <!-- TODO: 加查询方法 -->
          <el-button @click="handleSearch()">查询</el-button>
          <!-- 改deleteGood -->
          <el-button type="danger" @click="deleteBatch()">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="dataList" style="width: 100%" ref="tableRef" stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand" inline label-width="80px">
              <el-form-item label="商品名称">
                <span>{{ props.row.goodName }}</span>
              </el-form-item>
              <el-form-item label="描述">
                <span>{{ props.row.goodDescription }}</span>
              </el-form-item>
              <el-form-item label="所属者">
                <span>{{ props.row.goodOwner }}</span>
              </el-form-item>
              <el-form-item label="商品链接">
                <span>{{ props.row.goodAddress }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column sortable label="商品 ID" prop="goodId" align="center" width="100"></el-table-column>
        <el-table-column label="图片" prop="goodMainimageurl" align="center" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.goodMainimageurl" style="width:100%;" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="分类名称" prop="catName" align="center" width="160"></el-table-column> -->
        <el-table-column sortable label="价格" prop="goodPrice" align="center" width="150"></el-table-column>
        <el-table-column sortable label="销量" prop="goodSale" align="center" width="150"></el-table-column>
        <el-table-column label="上架状态" prop="goodOnsale" align="center" width="180">
          <template slot-scope="{row}">
            <el-tag v-if="row.goodOnsale=='0'" type="warning">新建</el-tag>
            <el-tag v-else-if="row.goodOnsale=='1'" type="success">上架</el-tag>
            <el-tag v-else type="danger">下架</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="是否推荐" prop="goodIsrecommend" align="center" width="180">
          <template slot-scope="{row}">
            <el-tag v-if="row.goodIsrecommend=='0'" type="danger">不推荐</el-tag>
            <el-tag v-else type="success">推荐</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.goodId)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.goodId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :page-sizes="[2, 5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>

      <!-- 弹窗, 新增 / 修改 -->
      <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="good" :rules="dataRule" label-position="right" label-width="120px">
          <el-form-item label="所属分类" prop="catId">
            <el-select
              v-model="good.catId"
              placeholder="选择分类类别"
              filterable
              @focus="getLatestOptions"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.catId"
                :label="item.catName"
                :value="item.catId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="goodPrice">
            <el-input v-model="good.goodPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="销量" prop="goodSale">
            <el-input v-model="good.goodSale" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="上架状态" prop="goodOnsale">
            <el-radio-group v-model="good.goodOnsale" size="medium">
              <el-radio-button label="0">新建</el-radio-button>
              <el-radio-button label="1">上架</el-radio-button>
              <el-radio-button label="2">下架</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否推荐" prop="goodIsrecommend">
            <el-radio-group v-model="good.goodIsrecommend" size="medium">
              <el-radio-button label="0">不推荐</el-radio-button>
              <el-radio-button label="1">推荐</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="名称" prop="goodName">
            <el-input v-model="good.goodName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="goodDescription">
            <el-input v-model="good.goodDescription" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属者" prop="goodOwner">
            <el-input v-model="good.goodOwner" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="PPT文件" prop="demoAddr">
            <single-upload v-model="good.demoAddr"></single-upload>
          </el-form-item>-->
        </el-form>
        <div slot="footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <!-- submitData方法依赖dialogType变量选择发什么请求 -->
          <el-button type="primary" @click="submitData">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  fetchCategory,
  infoGood,
  update,
  del,
  pageList,
  search
} from '@/api/good'
export default {
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 2
      },
      dataForm: {
        content: ''
      },
      categoryType: '',
      options: [],
      optionsLoading: true,
      dataList: [],
      dataListLoading: false,
      formTitle: '',
      dialogFormVisible: false,
      good: {},
      dataRule: {}
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.page.pageSize = val
      this.dataListLoading = true
      pageList(this.page.currentPage, this.page.pageSize)
        .then(({ data }) => {
          this.dataList = data.goods.records
          this.dataListLoading = false
        })
        .catch(() => {
          console.log('handleSizeChange GG')
        })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page.currentPage = val
      this.dataListLoading = true
      pageList(this.page.currentPage, this.page.pageSize)
        .then(({ data }) => {
          this.dataList = data.goods.records
          this.dataListLoading = false
        })
        .catch(() => {
          console.log('handleCurrentChange GG')
        })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      pageList(this.page.currentPage, this.page.pageSize)
        .then(({ data }) => {
          // console.log('获取商品数据', data)
          this.dataList = data.goods.records
          this.dataListLoading = false
        })
        .catch(() => {})
    },
    // 每次focus就请求获取最新分类
    getLatestOptions() {
      this.optionsLoading = true
      fetchCategory()
        .then(({ data }) => {
          //   console.log('getLatestOptions', data.data)
          this.optionsLoading = false
          this.options = data.categories
        })
        .catch(() => {
          console.log('getLatestOptions GG')
        })
    },
    handleSearch() {
      console.log('search', this.dataForm.content, this.categoryType)
      this.dataListLoading = true
      search(this.categoryType, this.dataForm.content)
        .then(({ data }) => {
          this.dataList = data.goods
          this.dataListLoading = false
        })
        .catch(() => {
          console.log('handleSearch GG')
        })
    },
    deleteBatch() {
      let ids = []
      let selection = this.$refs.tableRef.selection
      for (let i = 0; i < selection.length; ++i) {
        ids.push(selection[i].goodId)
      }
      //   console.log('deleteBatch', ids)
      this.$confirm(`确定批量删除【${ids}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del(ids).then(({ data }) => {
            // console.log('deleteBatch', data)
            this.getDataList()
            this.$message({
              message: '删除商品成功',
              type: 'success'
            })
          })
        })
        .catch(() => {
          console.log('deleteBatch GG')
        })
    },
    deleteHandle(id) {
      this.$confirm(`确定批量删除【${id}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del([id]).then(({ data }) => {
            // console.log('deleteHandle', data)
            this.getDataList()
            this.$message({
              message: '删除商品成功',
              type: 'success'
            })
          })
        })
        .catch(() => {
          console.log('deleteHandle GG')
        })
    },
    edit(id) {
      this.dialogFormVisible = true
      this.goodId = id
      infoGood(id)
        .then(({ data }) => {
          //   console.log('infoGood', data.data)
          this.good = data.good
        })
        .catch(() => {
          console.log('infoGood GG')
        })
    },
    submitData() {
      update(this.good)
        .then(({ data }) => {
          console.log('update', data)
          this.getDataList()
          this.$message({
            message: '修改商品信息成功',
            type: 'success'
          })
          this.dialogFormVisible = false
        })
        .catch(() => {
          console.log('update GG')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-weight: bold;
}
.demo-table-expand span {
  color: #cc0c5c;
}
.demo-table-expand .el-form-item {
  width: 40%;
}
</style>