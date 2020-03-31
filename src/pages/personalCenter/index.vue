<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>银行信息</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
     
    </Card>
  </div>
</template>

<script>
import { submitBankInfo, getBankInfo } from "@/seavers";
export default {
  data() {
    return {
      form: {
        udName: "",
        udBankPayee: "",
        udBankNumber: "",
        udBank: "",
        idCard: ""
      },
      rules: {
       
      }
    };
  },
  created() {
    this.getBankInfo();
  },
  methods: {
   
    submit() {
      if (!this.$util.isTrueValidateCodeBy18IdCard(this.form.idCard)) {
        this.$Message.error({
          background: true,
          content: "身份证格式有误"
        });
        return;
      }
      this.$refs.formObj.validate(valid => {
        if (valid) {
          submitBankInfo(this.form).then(res => {
            if (res.data.code == 200) {
              this.$router.push("/user/userMyProject");
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