<template>
  <el-card class="box-card">
    <!--    1.面包屑-->
    <!--    首页/用户管理/用户列表-->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1='用户管理' level2='用户列表'></my-bread>
    <!--    2.搜索-->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容"
                  v-model="query"
                  class="inputSearch"
                  clearable
                  @clear="loadUserList"
        >
          <el-button
          @click="searchUser"
            slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia">添加用户</el-button>
      </el-col>
    </el-row>
    <!--    3.表格-->
    <el-table
      :data="userlist"
      style="width: 100%">
      <!--      type='index'就是显示索引值-->
      <el-table-column
        type="index"
        label="#"
        width="100">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

      <el-table-column
        label="创建日期">
        <!--  如果单元格内显示的内容不是字符串（文本），
        需要给别显示的内容外层包裹一个template-->

        <!--
            template内部要用数据 设置slot-scope属性
            该属性的值是要用数据create_time的数据源userlist
        -->

        <!--
            slot-scope的值scope其实就是el-table绑定的数据userlist
            scope.row->数组的每个对象
        -->

        <!--  slot-scope会自动去上一级找数据源-->
        <template slot-scope="scope">
          {{scope.row.create_time|fmtdata}}
        </template>
      </el-table-column>

      <el-table-column
        label="用户状态">
        <template slot-scope="scope">
<!--          用户状态开关-->
          <el-switch
            @change="changeMgState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit"
            circle @click="showEditUserDia(scope.row)"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete"
            circle @click="showDeleUserMsgBox(scope.row.id)"></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check"
            circle @click="showSetUserRoleDia(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    4.分页-->
<!--    该接口支持分页 url参数中有pagenum pagesize  例如url: "users?query=&pagenum=1&pagesize=2"-->
<!--    @size-change 每页显示条数变化时 触发-->
<!--    @current-change 当前页改变时 触发-->
<!--    current-page 设置当前页是第几页-->
<!--    page-sizes 每页多少条的数据数组-->
<!--    page-size 第一次运行时显示的数组条数-->
<!--    total 数据总数-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

<!--     对话框-->
<!--    添加用户的对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </div>
    </el-dialog>
<!--    编辑用户的对话框-->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </div>
    </el-dialog>
<!--分配角色的对话框-->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{currUsername}}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
<!--          如果select的绑定的数据的值和option的value一样，-->
<!--          就会显示该option的label值-->
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option :label="item.roleName" :value="item.id"
            v-for="(item,i) in roles" :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      // 表格绑定数据
      userlist: [],
      // 分页相关数据
      total: -1,
      pagenum: 1,
      pagesize: 2,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 分配角色
      currRoleId: -1,
      currUserId: -1,
      currUsername: '',
      // 保存所有角色数据
      roles: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表的请求
    async getUserList () {
      // 需要授权的API，必须在请求头中使用 Authorization 字段提供 token 令牌(在http.js中axios里面统一设置了)
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )

      const {meta: {status, msg}, data: {users, total}} = res.data
      if (status === 200) {
        // 1.给表格数据赋值
        this.userlist = users
        // console.log(users)
        // 2.给total赋值
        this.total = total
        // 3.提示
        this.$message.success(msg)
      } else {
        // 3.提示
        this.$message.warning(msg)
      }
    },
    // 分页相关方法
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    // 搜索用户
    searchUser () {
      // 按照inout绑定的query参数 发请求
      this.getUserList()
    },
    // 清空数据框 重新获取数据
    loadUserList () {
      this.getUserList()
    },
    // 添加用户 - 显示对话框
    showAddUserDia () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 添加用户 - 发送请求
    async adduser () {
      // 关闭对话框
      this.dialogFormVisibleAdd = false

      const res = await this.$http.post('users', this.form)
      // console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        // 1.提示成功
        this.$message.success(msg)
        // 2.更新视图
        this.getUserList()
        // 3.清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除用户 打开消息框
    showDeleUserMsgBox (userId) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除的请求：id---->用户id
        // 怎么找id？ 两个思路
        // 1.data中找userId   X
        // 2.把userId以showDeleUserMsgBox参数形式传进来  V
        const res = await this.$http.delete(`users/${userId}`)
        if (res.data.meta.status === 200) {
          this.pagenum = 1
          // 更新视图
          this.getUserList()
          // 提示
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑用户 - 显示对话框
    showEditUserDia (user) {
      this.dialogFormVisibleEdit = true
      // 获取数据
      this.form = user
    },
    async edituser () {
      console.log(this.form)
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      console.log(res)
      this.dialogFormVisibleEdit = false
      this.getUserList()
    },
    // 修改状态
    async changeMgState (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res)
    },
    // 分配角色 - 打开对话框
    async showSetUserRoleDia (user) {
      this.currUsername = user.username
      // 拿id值
      this.currUserId = user.id
      // 获取所有角色
      const res1 = await this.$http.get(`roles`)
      this.roles = res1.data.data
      // 获取当前用户的角色
      const res = await this.$http.get(`users/${user.id}`)
      this.currRoleId = res.data.data.rid

      this.dialogFormVisibleRol = true
    },
    // 分配角色 - 发送请求
    async setRole () {
      // users/:id/role
      // :id 要修改的用户的id
      // 请求体中rid修改的新值角色id
      await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      })
      // 关闭对话框

      this.dialogFormVisibleRol = false
    }
  }
}
</script>

<style scoped>
  .box-card {
    height: 100%;
  }

  .inputSearch {
    width: 300px;
  }

  .searchRow {
    margin-top: 25px;
  }
</style>
