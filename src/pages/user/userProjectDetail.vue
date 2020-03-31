<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>用户</BreadcrumbItem>
      <BreadcrumbItem>我的项目</BreadcrumbItem>
      <BreadcrumbItem>详情</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <Form :model="infoForm" :label-width="130">
        <FormItem label="项目名称:">
          <Input :disabled="true" v-model="infoForm.iitemname"></Input>
        </FormItem>
        <FormItem label="参与项目需要金额:">
          <Input :disabled="true" v-model="infoForm.iuJoinitemmoney"></Input>
        </FormItem>
        <FormItem label="收款开户人:">
          <Input :disabled="true" v-model="infoForm.itemsBank.ibPayee"></Input>
        </FormItem>
        <FormItem label="收款银行:">
          <Input :disabled="true" v-model="infoForm.itemsBank.ibBank"></Input>
        </FormItem>
        <FormItem label="收款银行账户:">
          <Input :disabled="true" v-model="infoForm.itemsBank.ibBanknumber"></Input>
        </FormItem>
        <FormItem label="利息:">
          <Table max-height="350" :columns="columns" :data="data"></Table>
        </FormItem>
        <FormItem label="打款凭证:">
          <div v-if="imgUrl !=''">
            <viewer>
              <img id="viewerImg1" :src="$store.state.uploadUrl + imgUrl " />
            </viewer>
          </div>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import { getUserInfo, itemsUserDetails } from "@/seavers";
export default {
  data() {
    return {
      infoForm: {
        itemsBank: {
          ibBank: "",
          ibBanknumber: "",
          ibPayee: ""
        }
      },
      imgUrl: "",
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "利息",
          key: "irToaccount",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              this.$util.digitalConversion(params.row.irToaccount)
            );
          }
        },
        {
          title: "资金类型",
          key: "irType",
          align: "center",
          width: 120,
          render: (h, params) => {
            switch (params.row.irType) {
              case 0:
                return h("span", "利息");
              case 1:
                return h("span", "本金");
            }
          }
        },
        {
          title: "是否已打款",
          key: "irRepaymestate",
          align: "center",
          width: 120,
          render: (h, params) => {
            switch (params.row.irRepaymestate) {
              case 0:
                return h("span", "未打款");
              case 1:
                return h("span", "已打款");
              case 2:
                return h("span", "失效");
            }
          }
        },
        {
          title: "打款日期",
          key: "irLawday",
          minWidth: 100,
          align: "center"
        },
        {
          title: "打款凭证",
          key: "irPaymentvoucher",
          align: "center",
          width: 100,
          render: (h, params) => {
            return params.row.irPaymentvoucher
              ? h("viewer", [
                  h("img", {
                    attrs: {
                      src:
                        this.$store.state.uploadUrl +
                        params.row.irPaymentvoucher,
                      class: "viewerImg"
                    },
                    style: {
                      width: "40px",
                      height: "40px"
                    }
                  })
                ])
              : "";
          }
        }
      ],
      modalTitle: "",
      data: []
    };
  },
  created() {
    this.getTableList();
  },
  mounted() {},
  methods: {
    getTableList() {
      getUserInfo({ iriuId: this.$route.query.iriuId }).then(res => {
        if (res.data.code == 200) {
          this.data = res.data.result;
        } else {
           this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
      itemsUserDetails({
        itemId: this.$route.query.iid
      }).then(res => {
        if (res.data.code == 200) {
          this.infoForm = res.data.result;
          if (res.data.result.iuMoneyvoucher) {
            this.imgUrl = res.data.result.iuMoneyvoucher;
          }
        } else {
           this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    }
  }
};
</script>

<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
#viewerImg1 {
  width: 58px;
  height: 58px;
  border: 1px dashed #dcdee2;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
</style>
