<template>
    <div>

      <el-dialog title="编辑角色" :visible.sync="dialogFormVisible1">
        <el-form :model="form1">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form1.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="form1.miaoShu" autocomplete="off"></el-input>
          </el-form-item>

          <el-tree
            :data="menuData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible1 = false" v-on:click="update()">确 定</el-button>
        </div>
      </el-dialog>


      <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="form.miaoShu" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  v-on:click="formReset()">重置</el-button>
          <el-button type="primary" @click="dialogFormVisible = false" v-on:click="add()">确 定</el-button>
        </div>
      </el-dialog>

      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item>
          <el-row>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addRole()">添加角色</el-button>
          </el-row>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="pageInfo.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="testPage()">查询</el-button>
        </el-form-item>
      </el-form>


      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover">
              <p>角色名称: {{ scope.row.roleName }}</p>
              <p>角色描述: {{ scope.row.miaoShu }}</p>
              <el-button slot="reference" size="small" type="primary" icon="el-plus" plain>{{scope.row.roleName}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="miaoShu"
          label="角色描述">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button size="small" type="danger" icon="el-plus" v-on:click="del(scope.row)">删除</el-button>
              <el-button size="small" type="primary" icon="el-plus"  v-on:click="bangding(scope.row)">绑定权限</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 5, 10, 15]"
        :page-size=this.pageInfo.pageSize
        layout="sizes, prev, pager, next"
        :total=total>
      </el-pagination>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "juese",
      data(){
          return{
            pageInfo: {
              page:1,
              pageSize:5,
              name:""
            },
            total:10,
            multipleSelection:[],
            tableData:[],
            dialogFormVisible:false,
            formLabelWidth:'100px',
            form:{},
            dialogFormVisible1:false,
            form1:{},
            menuData:[],
            defaultProps:{
              id:'id',
              children: 'menuInfoList',
              label: 'menuName',
              code:'leval'
            },
            ids:""//获取树形菜单的所有id
          }
      },
      mounted() {
        this.testPage();
        axios.post(this.domain.serverpath+"menuList").then((res)=>{
          this.menuData=res.data;
          console.log(res.data)
        }).catch((err) => {
          this.$message.error('无此操作权限！');
        })
      },
      methods:{
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleSizeChange(pageSize) {
          console.log(`每页 ${pageSize} 条`);
          this.pageInfo.pageSize=pageSize;
          this.testPage();
        },
        handleCurrentChange(page) {
          console.log(`当前页: ${page}`);
          this.pageInfo.page=page;
          this.testPage();
        },
        testPage(){
          axios.post(this.domain.serverpath+"roleByPage",this.pageInfo).then((res)=>{
            this.tableData=res.data.list;
            console.log(res.data.list);
            this.total=res.data.total;
          }).catch((err) => {
            this.$message.error('无此操作权限！');
          })
        },
        addRole(){
          this.dialogFormVisible=true;
          this.form={id:0};
        },
        add(){
          axios.post(this.domain.serverpath+"addRole",this.form).then((res)=>{
            if(res.data>0){
              alert("添加成功")
              this.testPage();
            }else{
              alert("添加失败")
            }
          }).catch((err) => {
            this.$message.error('无此操作权限！');
          })
        },
        del(row){
          if(confirm("确定要删除吗？")){
            if(row.id!=null){
              axios.post(this.domain.serverpath+"delRole",row).then((res)=>{
                if(res.data.code==200){
                  alert("删除成功")
                  this.testPage();
                }
              }).catch((err) => {
                this.$message.error('无此操作权限！');
              })
            }

          }
        },
        bangding(thedate){
         this.dialogFormVisible1=true;
         this.form1=thedate;
          setTimeout(()=>{
            this.$refs.tree.setCheckedKeys(thedate.menuMids,true),0;
          })
        },
        update(){
          let ids= this.$refs.tree.getHalfCheckedKeys()+","+this.$refs.tree.getCheckedKeys();
          let map={};
          map.ids=ids;
          map.id=this.form1.id;
          map.roleName=this.form1.roleName
          map.miaoShu=this.form1.miaoShu
          console.log(map)
          axios.post(this.domain.serverpath+"updateRole",map).then((res)=>{
            if(res.data.status=200){
              alert("操作成功")
              this.testPage();
            }else{
              alert("操作失败")
            }
          }).catch((err) => {
            this.$message.error('无此操作权限！');
          })
        },
        formReset(){
          this.form={};
        }
      }
    }
</script>

<style scoped>

</style>
