<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>用户列表</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div style="margin-bottom: 5px;">
        <Button type="primary" @click="action('添加')">添 加</Button>
      </div>
      <div>
        <Table :columns="columns" :data="data" @on-sort-change="changeSort">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" @click="resetPassword(row.uid,row.version)" size="small">重置密码</Button>
            <!-- <Button type="primary" @click="showModal1(row)" size="small">指定微信用户</Button> -->
            <Button type="error" @click="action('修改',row)" size="small">修 改</Button>
            <!-- <Button
              v-if="row.utype != 0"
              type="error"
              @click="delUser(row.uid,row.version)"
              size="small"
            >删 除</Button>-->
          </template>
        </Table>
      </div>
      <div style="margin-top:15px;">
        <Page
          :total="total"
          @on-change="currentPage"
          show-total
          :page-size="size"
          show-elevator
          :styles="{textAlign:'center'}"
        />
      </div>
    </Card>

    <Modal v-model="modal" :title="modalTitle" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formObj" :model="infoForm" :label-width="130" :rules="rules">
        <FormItem label="平台人账号:" prop="uaccount">
          <Input
            :disabled="modalTitle == '修改'"
            v-model="infoForm.uaccount"
            placeholder="请输入平台人账号"
            style="width: 90%"
          ></Input>
        </FormItem>
        <FormItem label="用户类型:" prop="utype">
          <Select :disabled="modalTitle == '修改'" v-model="infoForm.utype" style="width: 90%">
            <Option value="0" label="超级管理员"></Option>
            <Option value="1" label="用户"></Option>
            <Option value="2" label="财务"></Option>
          </Select>
        </FormItem>
        <div
          v-if="(infoForm.utype == '1' && modalTitle == '修改') || (modalTitle == '添加' && infoForm.utype == '1')"
        >
          <FormItem label="额度:" prop="quota">
            <Input v-model="infoForm.quota" placeholder="请输入额度" style="width: 90%"></Input>
          </FormItem>

          <FormItem label="公司名称:" prop="company">
            <Input v-model="infoForm.company" placeholder="请输入公司名称" style="width: 90%"></Input>
          </FormItem>
          <FormItem label="职位:" prop="position">
            <Input v-model="infoForm.position" placeholder="请输入公司职位" style="width: 90%"></Input>
          </FormItem>
        </div>

        <FormItem label="密码:" v-if="modalTitle != '修改'" prop="upassword">
          <Input
            maxlength="18"
            type="password"
            v-model="infoForm.upassword"
            placeholder="请输入密码"
            style="width: 90%"
          ></Input>
        </FormItem>
        <FormItem label="确认密码:" v-if="modalTitle != '修改'" prop="surePassword">
          <Input
            maxlength="18"
            type="password"
            v-model="infoForm.surePassword"
            placeholder="请重新确认密码"
            style="width: 90%"
          ></Input>
        </FormItem>
        <FormItem label="平台人姓名:" prop="uname">
          <Input maxlength="10" v-model="infoForm.uname" placeholder="请输入平台人姓名" style="width: 90%"></Input>
        </FormItem>
        <FormItem label="手机:" prop="uphone">
          <Input v-model="infoForm.uphone" placeholder="请输入手机" style="width: 90%"></Input>
        </FormItem>

        <FormItem label="联系地址:" prop="uaddress">
          <Input
            maxlength="50"
            v-model="infoForm.uaddress"
            placeholder="请输入联系地址"
            style="width: 90%"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取 消</Button>
        <Button type="primary" @click="ok">确 认</Button>
      </div>
    </Modal>
    <Modal v-model="modal1" title="指定微信用户" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formObj1" :model="infoForm1" :label-width="130">
        <FormItem label="用户昵称:" prop="nickname">
          <Input :disabled="true" v-model="infoForm1.nickname" style="width: 90%"></Input>
        </FormItem>
        <FormItem label="微信账号:" prop="nickname">
          <Select v-model="infoForm1.uremark" filterable style="width: 90%">
            <Option
              v-for="item in selectData"
              :value="item.openid"
              :key="item.openid"
              :label="item.nickname"
            ></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel1">取 消</Button>
        <Button type="primary" @click="save">确 认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUserCon,
  register,
  resetPassword,
  vxUserGetAll,
  delUser
} from "@/seavers";
export default {
  data() {
    const surePassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.infoForm.upassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
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
      selectData: [],
      size: 10,
      permissions: window.localStorage.getItem("permissions"),
      modal: false,
      modal1: false,
      infoForm1: {},
      infoForm: {
        uaccount: "",
        uname: "",
        uphone: "",
        utype: "",
        surePassword: "",
        uaddress: "",
        upassword: "",
        position: "",
        company: "",
        quota: ""
      },
      page: 1,
      orderType: "",
      orderPermu: "",
      modalTitle: "",
      total: 0,
      columns: [
        { align: "center", title: "平台人账号", key: "uaccount", width: "90" },
        { align: "center", title: "平台人姓名", key: "uname", width: "90" },
        {
          align: "center",
          title: "状态",
          width: "70",
          key: "ustatus",
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                "before-change": () => {
                  return new Promise(resolve => {
                    this.$Modal.confirm({
                      title: "切换确认",
                      content: "确认修改状态？",
                      onOk: () => {
                        resolve();
                      }
                    });
                  });
                },
                value: params.row.ustatus == 0 //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": val => {
                  var form = {
                    uid: params.row.uid,
                    version: params.row.version
                  };
                  if (val) {
                    form.ustatus = 0;
                  } else {
                    form.ustatus = 1;
                  }
                  register(form).then(res => {});
                }
              }
            });
          }
        },
        {
          align: "center",
          title: "用户类型",
          width: "95",
          sortable: "custom",
          key: "utype",
          render: (h, params) => {
            switch (params.row.utype) {
              case "0":
                return h("span", "平台人");
              case "1":
                return h("span", "用户");
              case "2":
                return h("span", "财务");
            }
          }
        },
        {
          align: "center",
          title: "额度",
          key: "quota",
          width: "120",
          render: (h, params) => {
            return h("span", this.$util.digitalConversion(params.row.quota));
          }
        },
        {
          align: "center",
          title: "已用额度",
          key: "quota",
          width: "120",
          render: (h, params) => {
            return h(
              "span",
              this.$util.digitalConversion(params.row.usedQuota)
            );
          }
        },
        {
          align: "center",
          title: "公司名称",
          key: "company",
          minWidth: 150
        },
        {
          align: "center",
          title: "职位",
          width: "100",
          key: "position"
        },
        {
          align: "center",
          title: "注册时间",
          width: "100",
          sortable: "custom",
          key: "ucreateTime"
        },
        { align: "center", title: "手机", width: "115", key: "uphone" },
        { align: "center", title: "	联系地址", key: "uaddress", width: 150 },
        { align: "center", title: "	openId", key: "uremark", width: 100 },
        { align: "center", title: "操作", slot: "action", width: 170 }
      ],
      form: {
        iitemname: ""
      },
      rules: {
        uname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        company: [
          {
            required: true,
            message: "请输入公司",
            trigger: "blur"
          }
        ],
        position: [
          {
            required: true,
            message: "请输入职位",
            trigger: "blur"
          }
        ],
        quota: [
          {
            required: true,
            message: "请输入最高金额",
            trigger: "blur"
          }
        ],
        surePassword: [
          {
            required: true,
            validator: surePassword,
            trigger: "blur"
          }
        ],
        utype: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ],
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
          }
        ],
        uphone: [
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ]
      },

      data: []
    };
  },
  created() {
    this.getTableData();
    this.getData();
  },
  methods: {
    changeSort(a) {
      this.orderType = a.order;
      this.orderPermu = a.column.key;
      this.getTableData({ orderType: a.order, orderPermu: a.column.key });
    },
    // delUser(uid, version) {
    //   this.$Modal.confirm({
    //     title: "提示",
    //     content: "<p style='margin-top: 5px;'>确认删除用户？</p>",
    //     onOk: () => {
    //       delUser({ uid, version }).then(res => {
    //         if (res.data.code == 200) {
    //           this.$Message.success({
    //             background: true,
    //             content: "删除成功"
    //           });
    //           this.getTableData();
    //         } else {
    //           this.$Message.error({
    //             background: true,
    //             content: res.data.message
    //           });
    //         }
    //       });
    //     }
    //   });
    // },
    save() {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认指定微信用户？</p>",
        onOk: () => {
          register(this.infoForm1).then(res => {
            if (res.data.code == 200) {
              this.modal1 = false;
              this.getTableData();
              this.$Message.success({
                background: true,
                content: "指定微信用户成功"
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
    cancel1() {
      this.modal1 = false;
    },
    getData() {
      vxUserGetAll().then(res => {
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
    },
    showModal1(row) {
      this.modal1 = true;
      this.infoForm1.nickname = row.uname;
      this.infoForm1.uremark = row.uremark;
      this.infoForm1.uid = row.uid;
      this.infoForm1.version = row.version;
    },
    action(title, row) {
      if (title == "修改") {
        this.infoForm.uaccount = row.uaccount;
        this.infoForm.uname = row.uname;
        this.infoForm.uphone = row.uphone;
        this.infoForm.utype = row.utype;
        this.infoForm.uaddress = row.uaddress;
        this.infoForm.uid = row.uid;
        this.infoForm.quota = row.quota + "";
        this.infoForm.position = row.position;
        this.infoForm.company = row.company;
        this.infoForm.version = row.version;
      } else {
        this.infoForm = {
          uaccount: "",
          uname: "",
          uphone: "",
          utype: "",
          uaddress: "",
          surePassword: "",
          upassword: ""
        };
        this.$refs.formObj.resetFields();
      }
      this.modalTitle = title;
      this.modal = true;
    },
    resetPassword(uid, version) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认重置密码？</p>",
        onOk: () => {
          resetPassword({ uid, version }).then(res => {
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: res.data.result
              });
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
    },
    ok() {
      this.$refs.formObj.validate(valid => {
        if (valid) {
          if (this.modalTitle == "修改") {
            this.$Modal.confirm({
              title: "提示",
              content: "<p style='margin-top: 5px;'>确认修改用户？</p>",
              onOk: () => {
                let obj = {
                  uid: this.infoForm.uid,
                  uaddress: this.infoForm.uaddress,
                  uname: this.infoForm.uname,
                  uphone: this.infoForm.uphone,
                  position: this.infoForm.position,
                  quota: this.infoForm.quota,
                  company: this.infoForm.company,
                  version: this.infoForm.version
                };

                register(obj).then(res => {
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
              },
              onCancel: () => {}
            });
          } else {
            this.$Modal.confirm({
              title: "提示",
              content: "<p style='margin-top: 5px;'>确认添加用户？</p>",
              onOk: () => {
                register(this.infoForm).then(res => {
                  if (res.data.code == 200) {
                    this.modal = false;
                    this.getTableData();
                    this.$Message.success({
                      background: true,
                      content: "添加用户成功"
                    });
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
        }
      });
    },
    cancel() {
      this.modal = false;
      this.$refs.formObj.resetFields();
    },
    currentPage(val) {
      this.page = val;
      this.getTableData();
    },
    getTableData(ele) {
      let obj = {
        page: this.page,
        size: this.size,
        orderType: this.orderType,
        orderPermu: this.orderPermu
      };
      if (ele) {
        obj.orderPermu = ele.orderPermu;
        obj.orderType = ele.orderType;
      }

      getUserCon(obj).then(res => {
        if (res.data.code == 200) {
          this.data = res.data.result.data;
          this.total = res.data.result.count;
          this.page = res.data.result.page;
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