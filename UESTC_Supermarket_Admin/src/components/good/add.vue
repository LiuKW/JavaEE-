<template>
  <div>
    <el-row>
      <!-- 步骤栏 -->
      <el-col :span="24">
        <el-steps :active="active" finish-status="success">
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
          <el-step title="上传PPT及图片集" icon="el-icon-upload"></el-step>
          <el-step title="新增商品" icon="el-icon-picture"></el-step>
        </el-steps>
      </el-col>
      <!-- 基本信息 -->
      <el-col :span="24" v-show="active==0">
        <el-card style="width:80%;margin:20px auto">
          <el-form :model="good" label-position="right" label-width="120px">
            <el-form-item label="名称" prop="goodName">
              <el-input v-model="good.goodName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="goodDescription">
              <el-input v-model="good.goodDescription" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属者" prop="goodOwner">
              <el-input v-model="good.goodOwner" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="分类" prop="catId">
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
          </el-form>
        </el-card>
      </el-col>
      <!-- 上传PPT、默认图片、图片集 -->
      <el-col :span="24" v-show="active==1">
        <el-card style="width:80%;margin:20px auto">
          <el-form :model="good" label-position="right" label-width="120px">
            <!-- <el-form-item label="PPT文件" prop="demoAddr">
              <single-upload v-model="good.demoAddr"></single-upload>
            </el-form-item>-->
            <el-form-item label="默认图片" prop="goodMainimageurl">
              <single-upload v-model="good.goodMainimageurl"></single-upload>
            </el-form-item>
            <!-- 弄一个图片集，可以选哪个为默认图片 -->
            <el-form-item label="图片集">
              <multi-upload v-model="goodImages"></multi-upload>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="24" v-show="active==2">
        <el-card style="width:80%;margin:20px auto">
          <h1 style="text-align: center">确定新增该商品吗？是则请点击【确定添加】</h1>
          <el-button type="primary" @click="appendGood">确定添加</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-button style="margin-top: 12px;" @click="prev" v-show="active>0&&active<=2">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next" v-show="active<2">下一步</el-button>
  </div>
</template>

<script>
import SingleUpload from '@/components/upload/singleUpload'
import MultiUpload from '@/components/upload/multiUpload'
import { fetchCategory, save } from '@/api/good'
import { saveImages } from '@/api/images'

export default {
  components: { SingleUpload, MultiUpload },
  data() {
    return {
      active: 0,
      good: {
        // gid: null,
        goodName: '',
        goodDescription: '',
        goodOwner: '',
        catId: null,
        goodPrice: null,
        goodMainimageurl: '',
        goodAddress: '',
        goodSale: 0,
        goodOnsale: 0,
        goodIsrecommend: 0,
        createTime: null,
        updateTime: null
      },
      options: [],
      goodImages: []
    }
  },
  methods: {
    prev() {
      // 只能步骤二到步骤三可以回退
      if (this.active <= 2 && this.active > 0) this.active--
    },
    next() {
      if (this.active++ > 2) this.active = 0
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
    // 把catName查出来，然后把good 放到商品表
    // 获取刚刚插入的gid，放到商品图片表中 gid、名字null、url、排序0、默认图片0
    appendGood() {
      console.log('准备上传的信息', this.good)
      // 存商品表
      save(this.good)
        .then(({ data }) => {
          console.log('能看到新插入的ID嘛', data)
          let images = []
          for (let i = 0; i < this.goodImages.length; ++i) {
            images.push({
              goodId: data.insertGid,
              imageDescription: null,
              imageUrl: this.goodImages[i]
            })
          }
          console.log('存的images', images)
          // 存图片集
          saveImages(images)
            .then(() => {
              this.active = 0
              // 恢复默认值
              this.good.goodName = ''
              this.good.goodDescription = ''
              this.good.goodOwner = ''
              this.good.catId = null
              this.good.goodPrice = null
              this.good.goodMainimageurl = ''
              this.good.goodAddress = ''
              this.good.goodSale = 0
              this.good.goodOnsale = 0
              this.good.goodIsrecommend = 0
              this.goodImages = []
            })
            .catch(() => {
              console.log('保存图片集 GG')
            })

          this.$message({
            message: '新增商品成功',
            type: 'success'
          })
        })
        .catch(() => {
          console.log('appendGood GG')
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>