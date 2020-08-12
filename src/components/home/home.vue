<template>
  <!--  引入element.iu布局容器-->
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/logo.png" alt="无法显示图片" height="60" width="60"/>
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <h3>后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a href="#" class="loginout" @click="handleSignout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
<!--        侧边栏导航-->
        <el-menu
          :unique-opened="true"
          :router="true"
        >
 <!-- 1 -->
          <el-submenu :index="''+item.order" v-for="(item,index) in this.menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

              <el-menu-item :index="item1.path" v-for="(item1,index) in item.children" :key="index">
                <i class="el-icon-success"></i>
                <span>{{item1.authName}}</span>
              </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>

      <el-main class="main">
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus:[]
    }
  },
  // 权限验证
  // newVue之前自动触发
  beforeCreate () {
    // // 获取token
    // const token = localStorage.getItem('token')
    // // token 没有->登录
    // if (!token) {
    //   this.$router.push({name: 'login'})
    // }
    // if token 有->继续渲染组件
  },
  created() {
    this.getMenus()
  },
  methods: {
    handleSignout () {
      // 1.清除token
      localStorage.clear()
      // 2.提示
      this.$message.success('退出成功')
      // 3.来到login组件
      this.$router.push({name: 'login'})
    },
    async getMenus() {
      const res = await this.$http.get(`menus`)
      console.log(res);
      this.menus = res.data.data
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
  }

  .aside {
    background-color: #d3dce6;
  }

  .main {
    background-color: #e9eef3;
  }
  .middle {
    text-align: center;
  }
  .loginout {
    line-height: 60px;
    text-decoration: none;
  }
</style>
