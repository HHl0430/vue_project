<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>微信用户</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div style="margin-bottom: 5px;">
        <Button type="primary" @click="vxUserGetuserAll()">拉取用户信息</Button>
      </div>
      <div>
        <Table :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" @click="action(row)" size="small">设置系统账号</Button>
          </template>
        </Table>
      </div>
    </Card>
    <Modal v-model="modal" title="设置系统账号" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formObj" :model="infoForm" :label-width="130">
        <FormItem label="用户昵称:" prop="nickname">
          <Input :disabled="true" v-model="infoForm.nickname" style="width: 90%"></Input>
        </FormItem>
        <FormItem label="系统账号:" prop="nickname">
          <Select v-model="infoForm.uid" filterable style="width: 90%">
            <Option v-for="item in selectData" :value="item.key" :key="item.key">{{ item.label }}</Option>
          </Select>
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
import {
  vxUserGetAll,
  vxUserGetuserAll,
  getUserList,
  register
} from "@/seavers";

export default {
  data() {
    return {
      modal: false,
      modalTitle: "",
      total: 0,
      columns: [
        { align: "center", title: "微信用户昵称", key: "nickname" },
        {
          align: "center",
          title: "用户头像",
          key: "headimgurl",
          render: (h, params) => {
            return params.row.headimgurl
              ? h("viewer", [
                  h("img", {
                    attrs: {
                      src: params.row.headimgurl,
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
        },
        {
          align: "center",
          title: "是否关注",
          key: "subscribe",
          render: (h, params) => {
            switch (params.row.subscribe) {
              case 0:
                return h("span", "未关注");
              case 1:
                return h("span", "关注");
            }
          }
        },
        {
          align: "center",
          title: "性别",
          key: "sex",
          render: (h, params) => {
            switch (params.row.sex) {
              case 0:
                return h("span", "未知");
              case 1:
                return h("span", "男");
              case 2:
                return h("span", "女");
            }
          }
        },
        { align: "center", title: "语言", key: "language" },
        { align: "center", title: "国家", key: "country" },
        { align: "center", title: "省份", key: "province" },
        { align: "center", title: "城市", key: "city" },
        { align: "center", title: "系统账号", key: "remark" },
        { align: "center", title: "操作", slot: "action", width: 190 }
      ],
      infoForm: {},
      data: [],
      selectData: []
    };
  },
  created() {
    this.getTableData();
    this.getSelectData();
  },
  methods: {
    getTableData() {
      vxUserGetAll().then(res => {
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
    },
    vxUserGetuserAll() {
      vxUserGetuserAll().then(res => {
        if (res.data.code == 200) {
          this.$Message.success({
            background: true,
            content: "拉取成功"
          });
          this.getTableData();
        } else {
          this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    action(row) {
      this.infoForm = {
        nickname: row.nickname,
        uremark: row.openid,
        uid: ""
      };
      this.modalTitle = "添加备注";
      this.modal = true;
    },
    ok() {
      this.$refs.formObj.validate(valid => {
        this.$Modal.confirm({
          title: "提示",
          content: "<p style='margin-top: 5px;'>确认修改用户？</p>",
          onOk: () => {
            register(this.infoForm).then(res => {
              if (res.data.code == 200) {
                this.modal = false;
                this.getTableData();
                this.$Message.success({
                  background: true,
                  content: "修改用户成功"
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
      });
    },
    cancel() {
      this.modal = false;
      this.$refs.formObj.resetFields();
    },

    getSelectData() {
      getUserList().then(res => {
        if (res.data.code == 200) {
          this.selectData = res.data.result;
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
</style>
