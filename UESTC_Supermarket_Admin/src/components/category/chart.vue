<template>
  <div id="myChart" :style="{width: '100%', height: '600px'}"></div>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      // this.chart = echarts.init(this.$el);
      this.chart = this.$echarts.init(document.getElementById('myChart'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        title: {
          text: '分类可视化'
        },
        tooltip: {},
        xAxis: {
          data: ['人工智能', '云数据库', '云服务器', '云通信', '云存储']
          // data: this.xData
        },
        yAxis: {},
        series: [
          {
            name: '商品数',
            type: 'bar',
            data: [1, 2, 3, 2, 3]
            // data: this.yData
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
