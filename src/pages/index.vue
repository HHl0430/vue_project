<template>
  <div class="layout">
    <Layout style="height: 100%">
      <Header>
        <Menu mode="horizontal" theme="dark" :active-name="$store.state.aciveNav">
          <img src="../assets/logo.png" class="layout-logo" alt />
          <div class="user-info">
            <span @mouseenter="enter()" @mouseleave="leave()" class="info-box">
              <img class="user-img" src="../assets/user.jpg" alt />
              <span class="user-name">{{userName}}</span>
              <div class="personal" v-show="show">
                <!-- <span v-if="permissions == '1'" @click="goPersonal">银行信息</span> -->
                <span @click="$router.push('/userInfo')">个人中心</span>
                <span style="margin-bottom: 5px;" @click="modal = true">修改密码</span>
              </div>
            </span>
            <Icon @click="logout" style="cursor: pointer;" type="md-exit" size="20" color="#fff" />
          </div>
          <div class="layout-nav">
            <!-- name 不能又重复，必须要和router对应  -->

            <Submenu name="1" v-if="permissions == 1">
              <template slot="title">
                <Icon type="md-people" />项目管理
              </template>
              <MenuItem name="userMyProject" to="/user/userMyProject">我的项目</MenuItem>
            </Submenu>

            <Submenu name="2" v-if="permissions == 0">
              <template slot="title">
                <Icon type="ios-apps" />项目管理
              </template>
              <MenuItem name="releaseProject" to="/platform/releaseProject">新建项目</MenuItem>
              <MenuItem name="platformMyProject" to="/platform/platformMyProject">项目列表</MenuItem>
            </Submenu>
            <Submenu name="4" v-if="permissions == 0">
              <template slot="title">
                <Icon type="md-person-add" />用户管理
              </template>
              <MenuItem name="userControl" to="/userControl">用户列表</MenuItem>
              <MenuItem name="vxUserControl" to="/vxUserControl">微信用户</MenuItem>
            </Submenu>
            <MenuItem name="lending" v-if="permissions == 2" to="/finance/projectList">
              <Icon type="md-list" />项目列表
            </MenuItem>
            <Submenu name="statisticalChart">
              <template slot="title">
                <Icon type="ios-podium" />查询统计
              </template>
              <MenuItem name="statisticalChart" to="/statistical/statisticalChart">项目统计</MenuItem>
              <MenuItem v-if="permissions !== '1'" name="userChart" to="/statistical/userChart">用户统计</MenuItem>
            </Submenu>
          </div>
        </Menu>
      </Header>
      <Layout class="content">
        <router-view></router-view>
      </Layout>
    </Layout>
    <Modal v-model="modal" title="修改密码" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formObj" :model="infoForm" :label-width="130" :rules="rules">
        <!-- <FormItem label="原始密码:" prop="password">
          <Input
            maxlength="18"
            type="password"
            v-model="infoForm.password"
            placeholder="Enter something..."
            style="width: 90%"
          ></Input>
        </FormItem>-->
        <FormItem label="新密码:" prop="password">
          <Input
            maxlength="18"
            type="password"
            v-model="infoForm.password"
            placeholder="请输入新密码"
            style="width: 90%"
          ></Input>
        </FormItem>
        <FormItem label="确认密码:" prop="surePassword">
          <Input
            maxlength="18"
            type="password"
            v-model="infoForm.surePassword"
            placeholder="重复确认密码"
            style="width: 90%"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取 消</Button>
        <Button type="primary" @click="ok">确 认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { updatePassword } from "@/seavers";
export default {
  data() {
    const surePassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.infoForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      modal: false,
      userName: "",
      show: false,
      infoForm: {
        password: "",
        surePassword: ""
      },
      rules: {
        surePassword: [
          {
            required: true,
            validator: surePassword,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      permissions: localStorage.getItem("permissions")
    };
  },
  created() {
    this.userName = window.localStorage.getItem("userName");
  },
  methods: {
    ok() {
      this.$refs.formObj.validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: "提示",
            content: "<p style='margin-top: 5px;'>确认修改密码？</p>",
            onOk: () => {
              updatePassword(this.infoForm).then(res => {
                this.modal = false;
                if (res.data.code == 200) {
                  this.$Message.success({
                    background: true,
                    content: "修改密码成功"
                  });
                  this.$router.push("/login");
                } else {
                  this.$Message.destroy();
                  this.$Message.error({
                    background: true,
                    content: res.data.message
                  });
                }
              });
            },
            onCancel: () => {}
          });
        }
      });
    },
    cancel() {
      this.modal = false;
    },
    enter() {
      this.show = true;
    },
    leave() {
      this.show = false;
    },
    goPersonal() {
      this.$router.push({ path: "/personalCenter" });
    },
    logout() {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认登出？</p>",
        onOk: () => {
          // this.$Message.info("Clicked ok");
          this.$router.push({ path: "/login" });
        },
        onCancel: () => {}
      });
    }
  }
};
</script>
<style>
.ivu-menu-dark {
  z-index: 2;
}
.ivu-table-cell {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 75px;
  height: 40px;

  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.user-info {
  min-width: 190px;
  border-radius: 3px;
  float: right;
  position: relative;
  left: 70px;
}
.layout-nav {
  width: auto;
  margin: 0 auto;
  height: 100%;
  margin-left: 140px;
}
.user-img {
  width: 40px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
  cursor: pointer;
}
.user-name {
  color: #fff;
  cursor: pointer;
  margin: 0 5px;
}
.content {
  overflow: auto;
}
.info-box {
  position: relative;
  height: 100%;
  display: inline-block;
}
.personal {
  position: absolute;
  background: #fff;
  top: 60px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  border-color: #eee;
  width: 100px;
  line-height: 20px;
  padding-top: 5px;
  border-radius: 4px;
}
.personal span {
  padding: 5px;
  padding-left: 15px;
  display: block;
  cursor: pointer;
}
.personal span:hover {
  color: #2d8cf0;
}
.personal::before {
  content: "";
  height: 10px;
  position: absolute;
  top: -5px;
  left: 16px;
  width: 10px;
  transform: rotate(45deg);
  background: #fff;
}
</style>
