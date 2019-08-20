<template>
    <div>
      <el-tree
        :data="menuData"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="contextmenu">
      </el-tree>


      <el-dialog :title="formEntity.tableName" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="formEntity" label-width="200px" size="mini">
          <el-button type="primary" @click="toAdd()" icon="el-icon-plus" plain circle></el-button>
          <el-button type="primary" @click="toUpdate()" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" @click="toDelete()" icon="el-icon-delete" circle></el-button>
          <el-button type="warning" icon="el-icon-star-off" circle></el-button>
          <el-divider></el-divider>

          <el-form-item label="当前菜单等级：">
            {{formEntity.leval}}
          </el-form-item>
          <el-form-item label="当前菜单名称：">
            {{formEntity.menuName}}
          </el-form-item>
          <el-form-item label="当前菜单ID：">
            {{formEntity.id}}
          </el-form-item>

          <el-form-item :hidden="addHidden" v-if="formEntity.leval!==4" label="新添加子菜单名称">
            <el-input v-model="form.menuName"></el-input>
          </el-form-item>
          <el-form-item :hidden="addHidden" label="菜单访问URL">
            <el-input  v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item :hidden="updateHidden" label="修改菜单名称">
            <el-input v-model="formEntity.menuName"></el-input>
          </el-form-item>
          <el-form-item :hidden="updateHidden" label="菜单访问URL">
            <el-input v-model="formEntity.url"></el-input>
          </el-form-item>
          <el-form-item :hidden="deleteHidden" label="">
            你确定删除此条数据吗？
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="save()">保存</el-button>
            <el-button @click="close()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "quanxian",
      data(){
          return{
            menuData:[],
            defaultProps:{
              children: 'menuInfoList',
              label: 'menuName'
            },
            form:{},
            formEntity:{},
            dialogFormVisible:false,
            addHidden:false,
            updateHidden:true,
            deleteHidden:true,
            rolename:''
          }
      },
      mounted() {
       this.formMenu();
      },
      methods:{
          formMenu(){
            axios.post(this.domain.serverpath+"menuByList").then((res)=>{
              this.menuData=res.data;
              console.log(res.data)
            }).catch((err) => {
              this.$message.error('无此操作权限！');
            })
          },
        contextmenu(menulist){
          this.dialogFormVisible=true;
          this.formEntity=menulist;
        },
        save(){
          let uri = "";
          alert(this.form.id)
          if(this.form.id == 0){
            alert("进入添加方法")
            uri = this.domain.serverpath + "insertMenu";
            this.form.id = this.formEntity.id;
            this.form.leval = this.formEntity.leval;
          }else if(this.form.id == 35){
            alert("进入删除")
            uri = this.domain.serverpath+"deleteMenu";
            this.form.id=this.formEntity.id;
          } else if(this.form.id > 0){
            alert("进入修改方法")
            uri = this.domain.serverpath+"updateMenu"
            this.form = this.formEntity
          }
          alert(this.form.id)
          this.$axios.post(uri,this.form).then( (res)=>{
            if(res.data.code == 200){
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
              this.formMenu();
              this.dialogFormVisible = false;
              uri =null;
            }else{
              this.rolename = res.data.result;
              console.log(res.data.result);
              this.$notify.error({
                title: '错误',
                message: '该权限正在被绑定中'
              });
              this.formMenu();
              this.dialogFormVisible = false;
              uri =null;
            }
          } ).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: '无权限~_~，请联系管理员！'
            });
          })
        },
        close(){
          this.form={};
          this.dialogFormVisible=false;
        },
        toDelete(){
          this.form={id:35}
          this.updateHidden=true;
          this.deleteHidden=false;
          this.addHidden=true;
        },
        toUpdate(){
          this.form.id = this.formEntity.id;
          this.form.menuName=this.formEntity.menuName;
          this.form.url=this.formEntity.url;
          this.updateHidden=false;
          this.deleteHidden=true;
          this.addHidden=true;
        },
        toAdd(){
          this.form={id:0};
          this.initCRUD();
        },
        initCRUD(){
          if(this.formEntity.leval==4){
            this.updateHidden=false;
            this.deleteHidden=true;
            this.addHidden=true;
            this.toUpdate();
          }else {
            this.updateHidden=true;
            this.deleteHidden=true;
            this.addHidden=false;
          }
        },
        filterNode(){

        }
      }
    }
</script>

<style scoped>

</style>
