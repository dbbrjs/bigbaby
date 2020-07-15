<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
</el-breadcrumb>
</template>

<script>
// 自定义一个  多个组件使用的面包屑组件，进行二次封装
// 自定义提供组件 props:['level1','level2']
// 在main.js 引入
// Vue.component(MyBread.name,MyBread) 全局组件

export default {
  name: 'my-bread',
  data () {
    return {
      // level1: "",
      // level2: ""
    }
  },
  // props 值字符串数组
  // props 中的值的用法和data数据用法一样
  // props 中的数据的值 来源于使用组件时 传的值
  // props 中的数据也是该组件的属性 <child-a :msg="abc">
  props: [
    'level1', 'level2'
  ]
}
</script>
