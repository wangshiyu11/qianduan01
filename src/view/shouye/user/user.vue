<template>

<div>
    <el-tabs  v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first" >


        <div>
        <el-dialog title="绑定角色" :visible.sync="dialogFormVisible2">
          <el-form ref="form" label-width="80px">
            <el-form-item label="角色">
              <el-select v-model="roleIds" placeholder="请选择" >
                <el-option
                  v-for="item in liebiaoRole"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dialogFormVisible2 = false" v-on:click="saveRole()">绑定</el-button>
              <el-button @click="dialogFormVisible2 = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-dialog title="修改" :visible.sync="dialogFormVisible1">
          <el-form :model="form">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:10005/api/manger/addPic"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="form.userName" autocomplete="off"  size="small" ></el-input>
            </el-form-item>
            <el-form-item label="登录名" :label-width="formLabelWidth">
              <el-input v-model="form.loginName" autocomplete="off"  size="small" v-on:blur="findByloginName()"></el-input>
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth">
              <el-radio-group v-model="form.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible1 = false" v-on:click="save()">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="添加新用户" :visible.sync="dialogFormVisible">
          <el-form :model="form"  :rules="rules" ref="form" prop="url">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="http://localhost:10005/api/manger/addPic"
              :on-success="handleAvatarSuccess"
              :auto-upload="true"
              list-type="picture">
              <el-button slot="trigger" size="small" type="primary" @click="submitUpload" >选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
              <el-input v-model="form.userName" autocomplete="off"  size="small"></el-input>
            </el-form-item>
            <el-form-item label="登录名" :label-width="formLabelWidth" prop="loginName">
              <el-input v-model="form.loginName" autocomplete="off"  size="small"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth" prop="tel">
              <el-input v-model="form.tel" autocomplete="off"  size="small"></el-input>
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="form.password" autocomplete="off"  size="small"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth" prop="repassword">
              <el-input v-model="form.repassword" autocomplete="off"  size="small"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button  v-on:click="formReset()">重置</el-button>
            <el-button type="primary" @click="dialogFormVisible = false" v-on:click="save()">保存</el-button>
          </div>
        </el-dialog>

          <el-form>
            <el-form-item>
              <el-row>
                <span :hidden="tianjia">
                  <el-button size="small" icon="el-icon-plus" type="primary" @click="addUser()" hidden="hidden">添加新用户</el-button>
                </span>
                <el-button size="small" icon="el-icon-plus" type="primary" @click="export2Excel()">导出数据</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="pageInfo.name" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-input v-model="pageInfo.dt1" type="date" placeholder="选择日期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="pageInfo.dt2" type="date" placeholder="选择日期"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="pageInfo.xingbie" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
            prop="userName"
            label="用户名"
            width="180">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover">
                <p>
                  <el-image  :src="'http://49.232.19.36:8888/group1/'+scope.row.url+'_50x50.png'" style="height: 50px;width: 50px"></el-image>
                </p>
                <p>用户名: {{ scope.row.userName }}</p>
                <p>登录名: {{ scope.row.loginName }}</p>
                <p>性  别: {{ scope.row.sex }}</p>
                <p>电  话: {{ scope.row.tel}}</p>
                <p>部  门: {{ scope.row.buMen }}</p>
                <p>角  色: {{ scope.row.roleName }}</p>
                <el-button slot="reference" size="small" type="primary" icon="el-plus" plain>{{scope.row.userName}}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="loginName"
            label="登录名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex==0">男</span>
              <span v-if="scope.row.sex==1">女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="tel"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="buMen"
            label="部门">
          </el-table-column>
          <el-table-column
            prop="url"
            label="图片路径">
            <template  slot-scope="scope">
              <div>
                <el-image  :src="'http://49.232.19.36:8888/group1/'+scope.row.url+'_50x50.png'" style="height: 50px;width: 50px"></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="已绑定角色">
          </el-table-column>
          <el-table-column
            label="操作"
            width="300px">
            <template slot-scope="scope">
              <el-row>
                <span :hidden="bianji">
                  <el-button size="small" type="primary" icon="el-plus" plain v-on:click="update(scope.row)" hidden="hidden">编辑</el-button>
                </span>
                <span :hidden="shanchu">
                <el-button size="small" type="danger" icon="el-plus" v-on:click="del(scope.row)" hidden="hidden">删除</el-button>
                  </span>
                <span :hidden="bangdinguser">
                <el-button size="small" type="primary" icon="el-plus"  v-on:click="bangding(scope.row.id)" hidden="hidden">绑定角色</el-button>
                  </span>
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
      </el-tab-pane>
      <el-tab-pane label="导入数据" name="second">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://localhost:10005/api/manger/addExcel"
          :before-upload="beforeUpload"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过一个</div>

        </el-upload>
      </el-tab-pane>
    </el-tabs>

</div>


</template>

<script>
  import axios from 'axios'
    export default {
        name: "user",
      data(){
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
          return{
            tableData:[],
            multipleSelection:[],
            pageInfo:{
              page:1,
              pageSize:5,
              name:'',
              dt1:'',
              dt2:'',
              xingbie:''
            },
            imageUrl:"",
            options:[{
              value:'',
              label:'全部',
            }, {
              value:'0',
              label: '男'
            },
              {
                value:'1',
                label:'女'
              }],
            dialogFormVisible:false,
            dialogFormVisible1:false,
            dialogFormVisible2:false,
            formLabelWidth:'80px',
            form:{
              repassword:"",
              url:"",
            },
            fileList:[],
            total:10,
            id:0,
            //角色列表
            liebiaoRole:[],
            //roleids
            roleIds:[],
            userId:"",
            rules: {
              userName: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
              ],
              loginName: [
                { required: true, message: '请输入登录名', trigger: 'blur' },
              ],
              sex: [
                { required: true, message: '请至少选择一个',  trigger: 'blur' },
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
              ],
              repassword: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { validator: validatePass2, trigger: 'blur' }
              ],
              tel: [
                { required: true, message: '请输入电话号', trigger: 'blur' },
                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }
              ],
            },
            activeName: 'first',
            shachu:false,
            tianjia:false,
            bianji:false,
            bangdinguser:false,
          }
      },
      mounted(){
          //隐藏按钮
          let map=this.$store.state.userInfo.authmap;
          // ,alert(map["update"])
          if(map["del"]==""){
              this.shanchu=false
          }else if (map["del"]==null){
            this.shanchu=true
          } if(map["update"]==""){
            this.bianji=false
        }else if(map["update"]==null){
          this.bianji=true
        }if(map["bangdingRole"]==""){
           this.bangdinguser=false
        }else if(map["bangdingRole"]==null){
            this.bangdinguser=true
        }if(map["add"]==""){
          this.tianjia=false
        }else if(map["add"]==null){
          this.tianjia=true
        };

        axios.post(this.domain.serverpath+"liebiaoRole").then((res)=>{
          console.log(res.data)
          this.liebiaoRole=res.data;
        });

        this.testPage();
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
          axios.post(this.domain.serverpath+"userByList",this.pageInfo).then((res)=>{
            this.tableData=res.data.list;
            console.log(res.data);
            this.total=res.data.total;
          }).catch((err) => {
            this.$message.error('无此操作权限！');
          })
        },

        addUser(){
          this.dialogFormVisible=true;
          this.form={id:0};
        },

        update(thedate){
          this.dialogFormVisible1=true;
          this.imageUrl='http://49.232.19.36:8888/group1/'+thedate.url+'.png';
          alert(this.imageUrl)
          this.form=thedate;
        },

        save(){
          let url=this.domain.serverpath+"add";
          if(this.form.id>0){
            url=this.domain.serverpath+"update"
          }
          axios.post(url,this.form).then((res)=>{

            if(res.data>0){
              this.testPage();
              this.form={};
            }else{
              alert("操作失败")
            }
          }).catch((err) => {
            this.$message.error('无此操作权限！');
          })
        },

        del(row){
          if(confirm("确定要删除吗？")){
            axios.post(this.domain.serverpath+"del",row).then((res)=>{
              if(res.data.code==200){
                alert("删除成功")
                this.testPage();
              }else{
                this.$notify.error({
                  title: '错误',
                  message: '该用户被绑定,不能删除'
                })
              }
            }).catch((err) => {
              this.$message.error('无此操作权限！');
            })
          }
        },

        bangding(id){
          this.dialogFormVisible2=true;
          this.userId=id;
        },

        saveRole(){
          let param={};
          param.userId=this.userId;
          param.roleIds=this.roleIds;
          alert(param.roleIds)
          axios.post(this.domain.serverpath+"bangdingRole",param).then((res)=>{
            if(res.data>0){
              alert("绑定成功")
              this.testPage();
              this.roleIds="";
            }else{
              alert("绑定失败")
            }
          }).catch((err) => {
            this.$message.error('无此操作权限！');
          })
        },

        submitUpload() {
          this.$refs.upload.clearFiles();
        },
        handleAvatarSuccess(res, file){
          this.imageUrl = URL.createObjectURL(file.raw);
          this.form.url=file.name;
        },

        formReset(){
          this.form={};
          this.imageUrl="";
        },

        //判断用户名是否唯一
       findByloginName(){
          if(this.form.loginName==null){

          }
          axios.post(this.domain.serverpath+"findByloginName",this.form).then((res)=>{
            console.log(res.data)
            this.$data.loginName=res.data.loginName;
            if(loginName==this.$data.loginName){
              this.$message({
                message: '用户名唯一',
                type: 'success'
              });
            }else{
              this.$message.error('用户名不唯一');
            }
          })
        },
        handleClick(tab, event) {
          console.log(tab, event);
        },

        //判断上传格式
        beforeUpload(file) {
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
          const extension = testmsg === 'xls'
          const extension2 = testmsg === 'xlsx'
          if(!extension && !extension2) {
            this.$message({
              message: '上传文件只能是 xls、xlsx格式!',
              type: 'warning'
            });
          }
          return extension || extension2
        },
        //手动上传服务器
        submitUpload(){
          this.$refs.upload.submit();
        },

        //导出数据
        export2Excel() {
          alert("--------Excel---------")
          require.ensure([], () => {
            const { export_json_to_excel } = require('../../../excel/export2Excel');
            const tHeader = ['序号', '名称', '登陆名称','密码','性别','tel',];
            // 上面设置Excel的表格第一行的标题
            const filterVal = ['id', 'userName', 'loginName','password','sex','tel'];
            // 上面的index、phone_Num、school_Name是tableData里对象的属性
            const list = this.tableData;  //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '列表excel');
          })
        },

        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        }
      }
    }
</script>

<style scoped>

</style>
