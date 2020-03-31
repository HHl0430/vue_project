<template>
  <div class="page login">
    <div class="login-box">
      <span class="login-title">登录</span>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="username">
          <Input type="text" v-model="formInline.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="formInline.password"
            placeholder="Password"
            @keyup.enter.native="login"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem style="text-align:center;margin-top: 35px;">
          <Button type="primary" @click="handleSubmit">登 录</Button>
          <Button type="primary" @click="register">注 册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import { login } from "@/seavers";
import qs from "qs";
export default {
  data() {
    return {
      formInline: {
        username: "",
        password: ""
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码长度不能少于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    localStorage.removeItem("Token");
    localStorage.removeItem("permissions");
  },
  methods: {
    login() {
      this.handleSubmit();
    },
    register() {
      this.$router.push({
        path: "/register"
      });
    },
    handleSubmit() {
      this.$refs.formInline.validate(valid => {
        if (valid) {
          login(qs.stringify(this.formInline)).then(res => {
            if (res.data.code == 200) {
              localStorage.setItem("Token", res.data.result.adminToken);
              localStorage.setItem("permissions", res.data.result.user.utype);
              if (
                !res.data.result.userBank &&
                res.data.result.user.utype == "1"
              ) {
                this.$Notice.warning({
                  title: "提醒",
                  duration: 6,
                  render: h => {
                    return h("span", [
                      "请先完善",
                      h("a", "个人信息", this.$router.push("/userInfo"))
                    ]);
                  }
                });
              }
              localStorage.setItem("userName", res.data.result.name);
              this.$router.push({
                path: "/finance/projectList"
              });
            } else {
              this.$Message.error(res.data.message);
            }
          });
        } else {
          this.$Message.error("请输入账号密码");
        }
      });
    },
    toPerCenter() {}
  }
};
</script>
<style  scoped>
.login {
  position: relative;
  background: url(../../assets/login.png);
}
.login-box {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 10px 20px 10px;
  box-shadow: 2px 2px 4px #eae7e7;
  background: #fff;
}
.login-title {
  display: block;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 28px;
  color: #2d8cf0;
}
</style>
<style >
.ivu-input-group-append,
.ivu-input-group-prepend {
  padding: 8px 7px;
}
</style>
