<template>
  <el-card>
    <!-- 1.面包屑 -->
      <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2.提示 -->
       <el-alert
            title="添加商品信息"
            type="success"
            center
            show-icon
            class="alert">
        </el-alert>
    <!-- 3.步骤条 -->
        <el-steps :active="active/1" align-center finish-status="success" style="margin-top: 20px">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
    <!-- 4.标签页 -->
        <el-tabs v-model="active" tab-position="left" style="height: 200px;">
            <el-tab-pane name="1" label="基本信息">基本信息</el-tab-pane>
            <el-tab-pane name="2" label="商品参数">商品参数</el-tab-pane>
            <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
            <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
            <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
        </el-tabs>
  </el-card>
</template>

<script>
export default {
    data() {
        return {
            active:1
        }
    }
}
</script>

<style>
.alert {
    margin-top: 20px;
}
</style>