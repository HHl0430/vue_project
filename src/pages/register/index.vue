<template>
  <div class="page login">
    <div class="login-box">
      <span class="login-title">注册</span>
      <Form ref="form" :model="form" :rules="ruleInline">
        <FormItem prop="uaccount">
          <Input type="text" v-model="form.uaccount" placeholder="账号"></Input>
        </FormItem>
        <FormItem prop="upassword">
          <Input type="password" v-model="form.upassword" placeholder="密码"></Input>
        </FormItem>
        <FormItem prop="surePassword">
          <Input type="password" v-model="form.surePassword" placeholder="确认密码"></Input>
        </FormItem>
        <FormItem prop="uname">
          <Input type="text" v-model="form.uname" placeholder="名称"></Input>
        </FormItem>
        <FormItem prop="uphone">
          <Input type="text" v-model="form.uphone" placeholder="电话"></Input>
        </FormItem>
        <FormItem style="text-align:center;margin-top: 35px;">
          <Button @click="$router.push({path:'/login'})">登 录</Button>
          <Button type="primary" @click="sureRegister">注 册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import { register } from "@/seavers";
import qs from "qs";

export default {
  data() {
    const surePassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.form.upassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      form: {
        uaccount: "",
        upassword: "",
        surePassword: "",
        uname: "",
        uphone: "",
        utype: "1",
        check: false
      },
      ruleInline: {
        uaccount: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        upassword: [
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
        ],
        surePassword: [
          {
            validator: surePassword,
            trigger: "blur"
          }
        ],
        uname: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        uphone: [
          {
            required: true,
            message: "请输入电话",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    sureRegister() {
      this.$refs.form.validate(valid => {
        if (valid) {
          register(this.form).then(res => {
            if (res.data.code == 200) {
              this.$router.push({
                path: "/login"
              });
            } else {
               this.$Message.destroy();
              this.$Message.error({
                background: true,
                content: res.data.message
              });
            }
          });
        }
      });
    }
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
  min-height: 300px;
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
