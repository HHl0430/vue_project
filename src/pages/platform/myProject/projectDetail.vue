<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>平台</BreadcrumbItem>
      <BreadcrumbItem to="/platform/platformMyProject">我的项目</BreadcrumbItem>
      <BreadcrumbItem>详情</BreadcrumbItem>
      <Button
        style="float: right;margin-right: 20px"
        type="primary"
        @click="$router.push('/platform/platformMyProject')"
        size="small"
      >返回</Button>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formObj" :model="formObj" :label-width="180">
          <Row>
            <Divider style="font-weight: 700;color: #a9a906;" orientation="left">项目基本信息</Divider>
          </Row>
          <Row>
            <Col span="10">
              <FormItem prop="iitemname" label="项目名称:">
                <Input :disabled="true" type="text" v-model="formObj.iitemname" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目介绍:" prop="iiteminfo">
                <Input
                  :disabled="true"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  v-model="formObj.iiteminfo"
                  placeholder="请输入"
                ></Input>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10">
              <FormItem label="项目开始-结束日期:" prop="time">
                <DatePicker
                  :disabled="true"
                  type="daterange"
                  @on-change="proDate"
                  v-model="formObj.time"
                  placement="bottom-end"
                  placeholder="Select date"
                  style="width: 100%"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目筹资金额结束日期:" prop="iitemlastdate">
                <DatePicker
                  :disabled="true"
                  format="yyyy-MM-dd"
                  type="date"
                  @on-change="lastProDate"
                  v-model="formObj.iitemlastdate"
                  placeholder="Select date"
                  style="width: 100%"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10">
              <FormItem label="需要筹资金额:" prop="igatheringmoney">
                <Input
                  :disabled="true"
                  type="text"
                  v-model="formObj.igatheringmoney1"
                  placeholder="请输入"
                ></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目利率(月):" prop="irate">
                <Input :disabled="true" type="text" v-model="formObj.irate" placeholder="请输入">
                  <span slot="append">%</span>
                </Input>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10">
              <FormItem label="项目期数:" prop="iitemperiods">
                <Input
                  :disabled="true"
                  type="text"
                  v-model="formObj.iitemperiods"
                  placeholder="请输入"
                ></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="周期单位:" prop="radio">
                <RadioGroup v-model="formObj.radio">
                  <Radio label="按日计息" disabled></Radio>
                  <Radio label="按月计息" disabled></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目每期天数:" v-show="formObj.radio == '按日计息'">
                <Input
                  maxlength="3"
                  type="text"
                  disabled
                  v-model="formObj.iitemperiodsday"
                  placeholder="请输入"
                ></Input>
              </FormItem>
              <FormItem label="打款日期:" v-show="formObj.radio == '按月计息'">
                <Input
                  maxlength="2"
                  type="text"
                  disabled
                  v-model="formObj.iitemperiodsMonth"
                  placeholder="请输入"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Divider style="font-weight: 700;color: #a9a906;" orientation="left">银行基本信息</Divider>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="收款银行名称:" prop="ibBank">
                <Input :disabled="true" type="text" v-model="formObj.ibBank" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="收款银行账户:" prop="ibBanknumber">
                <Input
                  :disabled="true"
                  type="text"
                  v-model="formObj.ibBanknumber"
                  placeholder="请输入"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="收款开户人姓名:" prop="ibPayee">
                <Input :disabled="true" type="text" v-model="formObj.ibPayee" placeholder="请输入"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <Table :columns="columns" :data="data"></Table>
    </Card>
    <Modal v-model="modal" title="更换人员">
      <Form ref="rowInfo" :model="rowInfo" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="用户名:" prop="uname" style="margin-bottom: 0px;">
              <span>{{rowInfo.uname}}</span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户参与金额:" prop="iuJoinitemmoney" style="margin-bottom: 0px;">
              <span>{{rowInfo.iuJoinitemmoney}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="项目期数:" prop="uname">
              <span>{{formObj.iitemperiods}}</span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="已收期数:" prop="itemsRatePeriodsSum">
              <span>{{rowInfo.itemsRatePeriodsSum}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="新参与人员:" prop="model1">
              <i-select v-model="model1" filterable>
                <i-option
                  v-for="(item,index) in userList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</i-option>
              </i-select>
            </FormItem>
          </Col>
        </Row>
        <Checkbox style="margin-left: 15px;" v-model="confirmSend">是否发送短信</Checkbox>
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
  selectUserNoInItem,
  setProject,
  getMyProjectDetails,
  replaceUser,
  projectDetail
} from "@/seavers";
export default {
  data() {
    return {
      rowInfo: {},
      confirmSend: false,
      modal: false,
      userList: [],
      model1: "",
      formObj: {
        iitemname: "",
        iiteminfo: "",
        time: "",
        ibegintime: "",
        iendtime: "",
        igatheringmoney: "",
        igatheringmoney1: "",
        iitemlastdate: "",
        irate: "",
        iitemperiodsMonth: "",
        radio: "",
        iitemperiods: "",
        iitemperiodsday: "",
        userList: []
      },
      columnsArr: [],
      columns: [
        {
          align: "center",
          title: "用户名",
          key: "uname",
          width: 100,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.model1 = "";
                    if (this.formObj.iitemstate == 2) {
                      this.$Message.warning({
                        background: true,
                        content: "此项目已完结"
                      });
                      return;
                    }
                    if (params.row.iuJoinintention == 2) {
                      this.$Message.warning({
                        background: true,
                        content: "此用户已退出"
                      });
                      return;
                    }
                    if (
                      params.row.iuToaccount == 0 &&
                      params.row.iuJoinintention == 1
                    ) {
                      this.$Message.warning({
                        background: true,
                        content: "此用户打款未确认"
                      });
                      return;
                    }

                    this.getUser({
                      itemId: this.formObj.iid,
                      iuJoinitemmoney: params.row.iuJoinitemmoney
                    });
                    this.rowInfo = params.row;
                    this.modal = true;
                  }
                }
              },
              params.row.uname
            );
          }
        },
        {
          align: "center",
          title: "用户参与金额",
          key: "iuJoinitemmoney",
          width: 120,
          render: (h, params) => {
            return h(
              "span",
              this.$util.digitalConversion(params.row.iuJoinitemmoney)
            );
          }
        },
        {
          align: "center",
          title: "是否到账",
          key: "iuToaccount",

          width: 105,
          render: (h, params) => {
            switch (params.row.iuToaccount) {
              case 0:
                return h(
                  "span",
                  {
                    style: {
                      color: "red"
                    }
                  },
                  params.row.iuJoinintention == 1
                    ? "已打款未确认"
                    : `未打款${
                        params.row.iuJoinintention == 2
                          ? "(已退)"
                          : params.row.iuJoinintention == 3
                          ? "(无意向)"
                          : ""
                      }`
                );
              case 1:
                return h(
                  "span",
                  `已打款${params.row.iuJoinintention == 2 ? "(已退)" : ""}`
                );
            }
          }
        }
      ],
      data: [],
      userListAll: [],
      userRight: [],
      user: []
    };
  },
  created() {
    this.getProjectInfo();
  },
  methods: {
    getUser(obj) {
      selectUserNoInItem(obj).then(res => {
        if (res.data.code == 200) {
          res.data.result.forEach(item => {
            item.value = item.key;
          });
          this.userList = res.data.result;
        } else {
          this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    cancel() {
      this.modal = false;
    },
    ok() {
      if (this.model1 == "" || this.model1 == undefined) {
        this.$Message.error({
          background: true,
          content: "请选择更换人员"
        });
        return;
      }
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认更换？</p>",
        onOk: () => {
          let obj = {
            iuId: this.rowInfo.iuId,
            uid: this.model1,
            confirmSend: this.confirmSend ? "1" : "0"
          };
          replaceUser(obj).then(res => {
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: "更换成功"
              });
              this.columns = [
                {
                  align: "center",
                  title: "用户名",
                  key: "uname",
                  width: 100,
                  render: (h, params) => {
                    return h(
                      "a",
                      {
                        on: {
                          click: () => {
                            this.model1 = "";
                            if (params.row.iuJoinintention == 2) {
                              this.$Message.warning({
                                background: true,
                                content: "此用户已退出"
                              });
                              return;
                            }
                            if (
                              params.row.iuToaccount == 0 &&
                              params.row.iuJoinintention == 1
                            ) {
                              this.$Message.warning({
                                background: true,
                                content: "此用户打款未确认"
                              });
                              return;
                            }

                            this.getUser({
                              itemId: this.formObj.iid,
                              iuJoinitemmoney: params.row.iuJoinitemmoney
                            });
                            this.rowInfo = params.row;
                            this.modal = true;
                          }
                        }
                      },
                      params.row.uname
                    );
                  }
                },
                {
                  align: "center",
                  title: "用户参与金额",
                  key: "iuJoinitemmoney",
                  width: 120,
                  render: (h, params) => {
                    return h(
                      "span",
                      this.$util.digitalConversion(params.row.iuJoinitemmoney)
                    );
                  }
                },
                {
                  align: "center",
                  title: "是否到账",
                  key: "iuToaccount",

                  width: 105,
                  render: (h, params) => {
                    switch (params.row.iuToaccount) {
                      case 0:
                        return h(
                          "span",
                          {
                            style: {
                              color: "red"
                            }
                          },
                          params.row.iuJoinintention == 1
                            ? "已打款未确认"
                            : `未打款${
                                params.row.iuJoinintention == 2
                                  ? "(已退)"
                                  : params.row.iuJoinintention == 3
                                  ? "(无意向)"
                                  : ""
                              }`
                        );
                      case 1:
                        return h(
                          "span",
                          `已打款${
                            params.row.iuJoinintention == 2 ? "(已退)" : ""
                          }`
                        );
                    }
                  }
                }
              ];
              this.getProjectInfo();
              // this.getUser(this.formObj.iid);
              this.modal = false;
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
    getProjectInfo() {
      getMyProjectDetails({ itemsId: this.$route.query.iid }).then(res => {
        if (res.data.code == 200) {
          this.formObj = res.data.result;
          this.formObj.igatheringmoney = String(
            res.data.result.igatheringmoney
          );
          this.formObj.igatheringmoney1 = this.$util.digitalConversion(
            this.formObj.igatheringmoney
          );
          this.formObj.iitemperiodsday = String(
            res.data.result.iitemperiodsday
          );
          this.formObj.iitemperiods = String(res.data.result.iitemperiods);
          this.formObj.irate = String(res.data.result.irate);
          if (this.formObj.iitemperiodsType == 1) {
            this.formObj.radio = "按月计息";
          } else {
            this.formObj.radio = "按日计息";
          }
          this.formObj.time = [
            res.data.result.ibegintime,
            res.data.result.iendtime
          ];
          const arr = [];
          res.data.result.itemsUsers.forEach((item, index) => {
            if (index == 0) {
              var arr1 = [];
              for (let a in item.stringItemsRateHashMap) {
                arr1.push(a);
              }
              this.columnsArr = [];
              this.columnsArr = arr1;
            }
            this.userRight.push(item.iuUserid);
            let obj = {
              iuJoinitemmoney: item.iuJoinitemmoney,
              iuUserid: item.iuUserid,
              userName: item.uname
            };
            arr.push(obj);
          });

          this.columnsArr.forEach((item, index) => {
            this.columns.push({
              align: "center",
              title: `第${index + 1}期/${
                this.formObj.itemsUsers[0].timeList[index]
              }`,
              minWidth: 156,
              render: (h, params) => {
                return params.row.stringItemsRateHashMap
                  ? h(
                      "span",
                      this.$util.digitalConversion(
                        res.data.result.itemsUsers[params.index]
                          .stringItemsRateHashMap[item].irToaccount
                      )
                    )
                  : "";
              }
            });
          });

          this.columns.push({
            align: "center",
            title: `总利息`,
            minWidth: 100,
            render: (h, params) => {
              return h(
                "span",
                this.$util.digitalConversion(params.row.itemsRateSum)
              );
            }
          });

          const irLawday = this.formObj.itemsUsers[0].itemsRate.irLawday;
          this.columns.push({
            align: "center",
            title: `本金/${irLawday}`,
            minWidth: 156,
            render: (h, params) => {
              return h(
                "span",
                this.$util.digitalConversion(params.row.itemsRate.irToaccount)
              );
            }
          });
          this.columns.push({
            align: "center",
            title: `总金额`,
            minWidth: 100,
            render: (h, params) => {
              return h(
                "span",
                this.$util.digitalConversion(params.row.totalPrice)
              );
            }
          });
          this.data = res.data.result.itemsUsers;
          this.formObj.userList = arr;
        } else {
          this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },

    proDate(date) {
      this.formObj.ibegintime = date[0];
      this.formObj.iendtime = date[1];
    },
    lastProDate(date) {
      this.formObj.iitemlastdate = date;
    }
  }
};
</script>

<style>
.ivu-input-wrapper {
  width: 90%;
}
</style>