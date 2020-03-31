<template>
  <div class="page">
    <Breadcrumb style="height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>个人信息</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formObj" :model="form" label-position="right" :label-width="230" :rules="rules">
          <Row>
            <Divider style="font-weight: 700;color: #a9a906;" orientation="left">基本信息</Divider>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="账号:" prop="uaccount">
                <Input :disabled="true" maxlength="50" v-model="form.uaccount"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="姓名:" prop="uname">
                <Input maxlength="20" v-model="form.uname" placeholder="请输入姓名"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="手机号码:" prop="uphone">
                <Input maxlength="25" v-model="form.uphone" placeholder="请输入手机号码"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="联系地址:">
                <Input maxlength="50" placeholder="请输入联系地址" v-model="form.uaddress"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem v-if="permissions == '1'" label="身份证:" prop="idCard">
                <Input v-model="form.idCard" placeholder="请输入身份证"></Input>
              </FormItem>
            </Col>
            <Col span="10" v-if="permissions == '1'">
              <FormItem label="公司:">
                <Input maxlength="50" v-model="form.company" placeholder="请输入公司"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="permissions == '1'">
            <Col span="10">
              <FormItem label="职位:">
                <Input maxlength="50" v-model="form.position" placeholder="请输入职位"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="额度:">
                <Input :disabled="true" maxlength="50" v-model="quota"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="permissions == '1'">
            <Col span="10">
              <FormItem label="已使用额度:">
                <Input :disabled="true" maxlength="50" v-model="usedQuota"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Divider
              v-if="permissions == '1'"
              style="font-weight: 700;color: #a9a906;"
              orientation="left"
            >银行信息</Divider>
          </Row>

          <div v-if="permissions == '1'">
            <Row>
              <Col span="10">
                <FormItem label="银行名称:" prop="udBank">
                  <Input maxlength="50" v-model="form.udBank" placeholder="请输入银行名称"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="银行账户:" prop="udBankNumber">
                  <Input maxlength="20" v-model="form.udBankNumber" placeholder="请输入银行账户"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10">
                <FormItem label="开户行支行名称:" prop="udBankPayee">
                  <Input maxlength="25" v-model="form.udBankPayee" placeholder="请输入开户行支行名称"></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="开户人姓名:" prop="udName">
                  <Input maxlength="50" v-model="form.udName" placeholder="请输入开户人姓名"></Input>
                </FormItem>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span="20" style="text-align: center;">
              <FormItem :label-width="0">
                <Button type="primary" @click="submit">Save</Button>
                <Button @click="$router.push('/user/userMyProject')" style="margin-left: 8px">Back</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import {
  getUserDetail,
  register,
  getBankInfo,
  submitBankInfo
} from "@/seavers";
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback("手机号格式不正确");
      } else {
        callback();
      }
    };
    return {
      permissions: localStorage.getItem("permissions"),
      form: {
        uaccount: "",
        uname: "",
        uphone: "",
        uaddress: "",
        udName: "",
        udBankPayee: "",
        udBankNumber: "",
        udBank: "",
        idCard: ""
      },
      quota: "",
      usedQuota: "",
      rules: {
        uaccount: [
          {
            required: true,
            message: "账号",
            trigger: "blur"
          }
        ],
        uname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        uphone: [
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        udName: [
          {
            required: true,
            message: "请输入开户人姓名",
            trigger: "blur"
          }
        ],
        idCard: [
          {
            required: true,
            message: "请输入身份证",
            trigger: "blur"
          }
        ],
        udBankPayee: [
          {
            required: true,
            message: "请输入开户行支行名称",
            trigger: "blur"
          }
        ],
        udBankNumber: [
          {
            required: true,
            message: "请输入银行账户",
            trigger: "blur"
          }
        ],
        udBank: [
          {
            required: true,
            message: "请输入银行名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getUserDetail();
    this.getBankInfo();
  },
  methods: {
    getBankInfo() {
      getBankInfo().then(res => {
        if (res.data.code == 200) {
          let data = res.data.result;
          if (data) {
            this.form.udName = data.udName;
            this.form.udBankPayee = data.udBankPayee;
            this.form.udBankNumber = data.udBankNumber;
            this.form.udBank = data.udBank;
            this.form.idCard = data.idCard;
          }
        }
      });
    },
    getUserDetail() {
      getUserDetail().then(res => {
        if (res.data.code == 200) {
          this.quota = this.$util.digitalConversion(res.data.result.quota);
          this.usedQuota = this.$util.digitalConversion(
            res.data.result.usedQuota
          );
          this.form = { ...this.form, ...res.data.result };
        } else {
          this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    submit() {
      this.$refs.formObj.validate(valid => {
        if (valid) {
          let obj = {
            uaccount: this.form.uaccount,
            uname: this.form.uname,
            uphone: this.form.uphone,
            uaddress: this.form.uaddress,
            uid: this.form.uid
          };
          if (this.permissions == 1) {
            submitBankInfo(this.form).then(res => {
              if (res.data.code == 200) {
                this.$router.push("/user/userMyProject");
                this.$Message.destroy();
                this.$Message.success({
                  background: true,
                  content: "补充信息成功"
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
          register(obj).then(res => {
            if (res.data.code == 200) {
              this.$router.push("/user/userMyProject");
              this.$Message.destroy();
              this.$Message.success({
                background: true,
                content: "补充信息成功"
              });
              this.getUserDetail();
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
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>

<style>
.ivu-input-wrapper {
  width: 90%;
}
</style>