<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <el-row class="addrolebtn">
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>

    <el-table :data="rolelist" style="width: 100%">

      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item,i) in scope.row.children" :key="i">
            <el-col :span="3">
              <!-- 传角色id 和权限id -->
              <!-- 关闭标签时 触发close事件 -->
              <el-tag @close="deleRight(scope.row,item.id)" closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="21">
              <el-row v-for="(item1,i) in item.children" :key="i">
                <el-col :span="4">
                <el-tag @close="deleRight(scope.row,item1.id)" closable type="success">{{item1.authName}}</el-tag>
                 <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                    <el-tag @close="deleRight(scope.row,item2.id)" closable type="warning" v-for="(item2,i) in item1.children" :key="i">{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <!-- 无权限的提示 -->
          <span v-if="scope.row.children.length===0">未分配权限</span>

        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="150"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            size="mini" plain type="success" icon="el-icon-check" circle
            @click="showSetRightDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
        <!--
          树形结构
          data->数据源[]
          show-checkbox -> 选择框
          node-key 每个节点的唯一标识 通常是data数据源中key名id
          defaul-expanded-keys 默认展开[要展开的节点的id]
          defaul-checked-keys 默认选择[要选择的节点的id]
          props 配置项 {label，children}
            label 节点的文字标题和 children 节点的子节点
            值都来源于data绑定的数据源中的该数据的key名 'label'和'children'
           -->
        <el-tree
          ref="tree"
          :data="treelist"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="arrcheck"
          :props="defaultProps">
        </el-tree>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
          <el-button type="primary" @click="setRoleRight">确 定</el-button>
        </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      // 树形结构的数据
      treelist: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      arrexpend: [],
      arrcheck: [],
      currRoleId: ''

    }
  },
  created () {
    this.getRolelist()
  },
  methods: {
    async getRolelist () {
      const res = await this.$http.get(`roles`)
      // console.log(res);
      this.rolelist = res.data.data
    },
    // 取消权限
    async deleRight (role, rightId) {
      // roles/:roleId/rights/:rightId
      // roleId 当前角色的id
      // rightId 要删除的权限id
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      // console.log(res)
      // 删除成功 返回了200和该角色的剩余权限
      if (res.data.meta.status === 200) {
        role.children = res.data.data
        // this.getRolelist();
      }
    },
    async showSetRightDia (role) {
      console.log(role)
      // 给currRoleId赋值
      this.currRoleId = role.id

      // 获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`)
      this.treelist = res.data.data
      // 获取当前角色role 的权限id
      var aeetemp1 = []
      role.children.forEach(item1 => {
        // aeetemp1.push(item1.id)
        item1.children.forEach(item2 => {
          // aeetemp1.push(item2.id)
          item2.children.forEach(item3 => {
            aeetemp1.push(item3.id)
          })
        })
      })
      this.arrcheck = aeetemp1

      this.dialogFormVisibleRight = true
    },
    // 修改权限 - 发送请求
    async setRoleRight () {
      // 获取全选的id
      let arr1 = this.$refs.tree.getCheckedKeys()
      // 获取半选的id
      let arr2 = this.$refs.tree.getHalfCheckedKeys()

      let arr = [...arr1, ...arr2]
      // rids树形节点中 所有全选和半选的label的id []
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      console.log(res)
      // 更新视图
      this.getRolelist()

      this.dialogFormVisibleRight = false
    }

  }
}
</script>

<style scoped>
.addrolebtn {
  margin-top: 20px;
}
</style>
