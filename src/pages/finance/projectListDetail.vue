<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>财务</BreadcrumbItem>
      <BreadcrumbItem to="/finance/projectList">项目列表</BreadcrumbItem>
      <BreadcrumbItem>详情</BreadcrumbItem>
      <Button
        style="float: right;margin-right: 20px"
        type="primary"
        @click="$router.push('/finance/projectList')"
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
                <Input
                  :disabled="true"
                  type="text"
                  v-model="formObj.iitemname"
                  placeholder="请输入项目名称"
                ></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目介绍:" prop="iiteminfo">
                <Input
                  :disabled="true"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  v-model="formObj.iiteminfo"
                  placeholder="请输入项目介绍"
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
                  placeholder="请输入需要筹资金额"
                ></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目利率(月):" prop="irate">
                <Input :disabled="true" type="text" v-model="formObj.irate" placeholder="请输入项目利率">
                  <span slot="append">%</span>
                </Input>
              </FormItem>
            </Col>
          </Row>

          <Row>
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
                  placeholder="请输入项目每期天数"
                ></Input>
              </FormItem>
              <FormItem label="打款日期:" v-show="formObj.radio == '按月计息'">
                <Input
                  maxlength="2"
                  type="text"
                  disabled
                  v-model="formObj.iitemperiodsMonth"
                  placeholder="请输入打款日期"
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
                <Input
                  :disabled="true"
                  type="text"
                  v-model="formObj.ibBank"
                  placeholder="请输入收款银行名称"
                ></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="收款银行账户:" prop="ibBanknumber">
                <Input
                  :disabled="true"
                  type="text"
                  v-model="formObj.ibBanknumber"
                  placeholder="请输入收款银行账户"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="收款开户人姓名:" prop="ibPayee">
                <Input
                  :disabled="true"
                  type="text"
                  v-model="formObj.ibPayee"
                  placeholder="请输入收款开户人姓名"
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <Table :columns="columns" :data="data"></Table>
    </Card>
    <Modal v-model="modal1" :title="moneyTitle" @on-ok="ok" @on-cancel="cancel">
      <Form :model="infoForm" :label-width="130">
        <FormItem label="用户名称:">
          <Input :disabled="true" v-model="infoForm.uname" placeholder="请输入用户名称"></Input>
        </FormItem>
        <FormItem label="打款金额类型:">
          <Input disabled v-model="uType"></Input>
        </FormItem>
        <FormItem label="打款金额:">
          <Input :disabled="true" v-model="infoForm.itemsRate.irToaccount" placeholder="请输入打款金额"></Input>
        </FormItem>
        <FormItem label="实际打款金额:">
          <Input
            :disabled="moneyTitle =='打款详情'"
            v-model="infoForm.actualPayment"
            placeholder="请输入实际打款金额"
          ></Input>
        </FormItem>
        <FormItem label="打款开户账号:">
          <Input :disabled="true" v-model="infoForm.userBank.udBankNumber" placeholder="请输入打款开户账号"></Input>
        </FormItem>
        <FormItem label="打款开户人姓名:">
          <Input :disabled="true" v-model="infoForm.userBank.udName" placeholder="请输入打款开户人姓名"></Input>
        </FormItem>
        <FormItem label="打款银行名称:">
          <Input :disabled="true" v-model="infoForm.userBank.udBank" placeholder="请输入打款银行名称"></Input>
        </FormItem>
        <FormItem label="打款备注:">
          <Input
            type="textarea"
            :disabled="moneyTitle =='打款详情'"
            :autosize="{minRows: 2,maxRows: 5}"
            v-model="infoForm.remark"
            placeholder="请输入打款备注"
          ></Input>
        </FormItem>
        <FormItem label="打款凭证:">
          <div v-if="moneyTitle !== '打款详情'">
            <div class="demo-upload-list" v-for="item in uploadList">
              <template v-if="item.status === 'finished'">
                <img :src="item.url" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              name="file"
              :disabled="uploadList.length >= 1 "
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              :action=" $store.state.uploadSever + '/sys/file/upload'"
              style="display: inline-block;width:58px;"
            >
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <viewer style="display:none">
              <img
                id="viewerImg"
                class="viewerImg"
                :src="$store.state.uploadUrl + imgName "
                style="width: 100%"
              />
            </viewer>
          </div>
          <div v-if="moneyTitle == '打款详情'  &&  infoForm.irPaymentvoucher !=''">
            <viewer>
              <img id="viewerImg1" :src="$store.state.uploadUrl + infoForm.irPaymentvoucher " />
            </viewer>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取 消</Button>
        <Button type="primary" v-if="moneyTitle !== '打款详情'" @click="ok">确 认</Button>
      </div>
    </Modal>
    <Modal v-model="modal" :title="modalTitle">
      <Form ref="moneyForm" :model="moneyForm" :label-width="110">
        <FormItem label="用户名:">
          <Input :disabled="true" type="text" v-model="moneyForm.uname" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="用户参与金额:">
          <Input :disabled="true" type="text" v-model="moneyForm.iuJoinitemmoney" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注:">
          <Input
            :disabled="modalTitle !== '确认到账'"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            v-model="moneyForm.remark"
            placeholder="请输入备注"
          ></Input>
        </FormItem>
        <FormItem label="打款凭证:">
          <div v-if="moneyForm.iuMoneyvoucherList.length > 0">
            <viewer>
              <img
                v-for="item in moneyForm.iuMoneyvoucherList"
                id="viewerImg1"
                :src="$store.state.uploadUrl + item "
              />
            </viewer>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="modal = false">取 消</Button>
        <Button v-if="modalTitle == '确认到账'" type="primary" @click="sure">确认到账</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUserList,
  setProject,
  getMyProjectDetails,
  sureCollection,
  sureLending
} from "@/seavers";
export default {
  data() {
    return {
      modal1: false,
      modal: false,
      formObj: {
        iitemname: "",
        iiteminfo: "",
        time: "",
        radio: "",
        ibegintime: "",
        iendtime: "",
        igatheringmoney: "",
        igatheringmoney1: "",
        iitemlastdate: "",
        irate: "",
        iitemperiods: "",
        iitemperiodsday: ""
      },
      moneyTitle: "",
      iuId: "",
      moneyForm: {
        uname: "",
        iuJoinitemmoney: "",
        iuMoneyvoucherList: [],
        remark: ""
      },
      modalTitle: "",
      headers: {
        enctype: "multipart/form-data",
        "Admin-Token": window.localStorage.getItem("Token")
      },
      infoForm: {
        irid: "",
        irPaymentvoucher: "",
        uname: "",
        remark: "",
        itemsRate: {
          irToaccount: ""
        },
        userBank: {
          udBankNumber: "",
          udBank: ""
        }
      },
      columnsArr: [],
      columns: [
        {
          align: "center",
          title: "用户名",
          key: "uname",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              params.row.uname +
                ` ${
                  params.row.iuJoinintention == 2
                    ? "(已退)"
                    : params.row.iuJoinintention == 3
                    ? "(无意向)"
                    : ""
                }`
            );
          }
        },
        {
          align: "center",
          title: "用户参与金额",
          key: "iuJoinitemmoney",
          minWidth: 120,
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
          width: 95,
          render: (h, params) => {
            switch (params.row.iuToaccount) {
              case 1:
                return h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      background: "#4bc588"
                    },
                    on: {
                      click: () => {
                        this.modalTitle = "到账查看";
                        this.moneyForm = { ...this.moneyForm, ...params.row };
                        this.moneyForm.iuJoinitemmoney = this.$util.digitalConversion(
                          params.row.iuJoinitemmoney
                        );
                        this.iuId = params.row.iuId;
                        this.modal = true;
                      }
                    }
                  },
                  "到账查看"
                );
              case 0:
                return h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                      disabled: !(
                        params.row.iuToaccount == 0 &&
                        params.row.iuJoinintention == 1
                      )
                    },
                    on: {
                      click: () => {
                        this.modalTitle = "确认到账";
                        this.moneyForm = { ...this.moneyForm, ...params.row };
                        this.moneyForm.iuJoinitemmoney = this.$util.digitalConversion(
                          params.row.iuJoinitemmoney
                        );
                        this.iuId = params.row.iuId;
                        this.modal = true;
                      }
                    }
                  },
                  "确认到账"
                );
            }
          }
        },
        {
          align: "center",
          title: " ",
          width: 10,
          className: "demo-table-info-column",
          render: (h, params) => {
            return h("span", "");
          }
        }
      ],
      imgName: "",
      uploadList: [],
      defaultList: [],
      data: [],
      userListAll: [],
      userRight: [],
      user: [],
      uType: ""
    };
  },
  created() {
    this.getProjectInfo();
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    //确认到账
    sure() {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认已到账？</p>",
        onOk: () => {
          sureCollection({
            iuId: this.iuId,
            remark: this.moneyForm.remark
          }).then(res => {
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: "成功"
              });
              this.modal = false;
              this.getProjectInfo();
              this.initialColu();
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
    //查看图片
    handleView(name) {
      document.getElementById("viewerImg").click();
    },
    //删除图片
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      delFile({ url: file.response.result }).then(res => {});
    },
    //图片上传成功
    handleSuccess(res, file) {
      file.url = this.$store.state.uploadUrl + res.result;
      file.name = res.result;
      this.imgName = file.name;
    },
    //图片上传失败和各种限制
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传失败",
        desc: "该文件格式不对"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "上传错误",
        desc: "该图片大于2MB"
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    },
    //利息/本金打款
    ok() {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认打款？</p>",
        onOk: () => {
          var obj = {};
          if (this.uploadList.length > 0) {
            obj.irPaymentvoucher = this.uploadList[0].response.result;
          } else {
            obj.irPaymentvoucher = "";
          }
          if (this.infoForm.actualPayment === "") {
            this.$Message.error("请输入实际打款金额");
            return;
          }
          obj.irId = this.infoForm.irid;
          obj.actualPayment = this.infoForm.actualPayment;
          obj.version = this.infoForm.itemsRate.version;
          obj.remark = this.infoForm.remark;
          sureLending(obj).then(res => {
            this.modal1 = false;
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: "确认打款成功"
              });
              this.$refs.upload.fileList.splice(0, 1);
              this.data = [];
              this.initialColu();
              this.getProjectInfo();
            }
          });
        },
        onCancel: () => {}
      });
    },
    cancel() {
      this.modal1 = false;
      if (this.moneyTitle !== "打款详情") {
        this.$refs.upload.fileList.splice(0, 1);
      }
    },
    //初始化columns 防止重复添加表头
    initialColu() {
      this.columns = [
        {
          align: "center",
          title: "用户名",
          key: "uname",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              params.row.uname +
                ` ${
                  params.row.iuJoinintention == 2
                    ? "(已退)"
                    : params.row.iuJoinintention == 3
                    ? "(无意向)"
                    : ""
                }`
            );
          }
        },
        {
          align: "center",
          title: "用户参与金额",
          key: "iuJoinitemmoney",
          minWidth: 120,
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
          width: 95,
          render: (h, params) => {
            switch (params.row.iuToaccount) {
              case 1:
                return h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      background: "#4bc588"
                    },
                    on: {
                      click: () => {
                        this.modalTitle = "到账查看";
                        this.moneyForm = { ...this.moneyForm, ...params.row };
                        this.moneyForm.iuJoinitemmoney = this.$util.digitalConversion(
                          params.row.iuJoinitemmoney
                        );
                        this.iuId = params.row.iuId;
                        this.modal = true;
                      }
                    }
                  },
                  "到账查看"
                );
              case 0:
                return h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                      disabled: !(
                        params.row.iuToaccount == 0 &&
                        params.row.iuJoinintention == 1
                      )
                    },
                    on: {
                      click: () => {
                        this.modalTitle = "确认到账";
                        this.moneyForm = { ...this.moneyForm, ...params.row };
                        this.moneyForm.iuJoinitemmoney = this.$util.digitalConversion(
                          params.row.iuJoinitemmoney
                        );
                        this.iuId = params.row.iuId;
                        this.modal = true;
                      }
                    }
                  },
                  "确认到账"
                );
            }
          }
        },
        {
          align: "center",
          title: " ",
          width: 10,
          className: "demo-table-info-column",
          render: (h, params) => {
            return h("span", "");
          }
        }
      ];
    },
    //获取数据,并自动添加表头
    getProjectInfo() {
      getMyProjectDetails({ itemsId: this.$route.query.iid }).then(res => {
        if (res.data.code == 200) {
          this.formObj = res.data.result;
          //时间赋值
          this.formObj.igatheringmoney1 = this.$util.digitalConversion(
            this.formObj.igatheringmoney
          );
          if (this.formObj.iitemperiodsType == 1) {
            this.formObj.radio = "按月计息";
          } else {
            this.formObj.radio = "按日计息";
          }
          this.formObj.time = [this.formObj.ibegintime, this.formObj.iendtime];
          const itemsUsersArr = this.formObj.itemsUsers;
          itemsUsersArr.forEach((item, index) => {
            if (index == 0) {
              var arr1 = [];
              for (let a in item.stringItemsRateHashMap) {
                arr1.push(a);
              }
              this.columnsArr = [];
              this.columnsArr = arr1;
            }
          });
          //循环添加表头
          this.columnsArr.forEach((item, index) => {
            this.columns.push({
              title: itemsUsersArr[0].timeList[index],
              align: "center",
              width: 115,
              render: (h, params) => {
                switch (
                  itemsUsersArr[params.index].stringItemsRateHashMap[item]
                    .irRepaymestate
                ) {
                  case 1:
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            marginTop: "10px",
                            display: "block",
                            borderBottom: "1px solid",
                            margin: " 5px 10px",
                            paddingBottom: " 5px"
                          }
                        },
                        this.$util.digitalConversion(
                          itemsUsersArr[params.index].stringItemsRateHashMap[
                            item
                          ].irToaccount
                        )
                      ),
                      h(
                        "Button",
                        {
                          props: {
                            type: "success",
                            size: "small"
                          },
                          style: {
                            marginBottom: " 5px",
                            background: "#4bc588"
                          },
                          on: {
                            click: () => {
                              this.moneyTitle = "打款详情";
                              this.uType = "利息";
                              this.infoForm = params.row;
                              this.infoForm.irPaymentvoucher =
                                itemsUsersArr[
                                  params.index
                                ].stringItemsRateHashMap[item].irPaymentvoucher;
                              if (!params.row.userBank) {
                                this.infoForm.userBank = {
                                  udBankNumber: "",
                                  udBank: ""
                                };
                              }
                              this.infoForm.irid =
                                itemsUsersArr[
                                  params.index
                                ].stringItemsRateHashMap[item].irId;
                              this.modal1 = true;
                              this.infoForm.actualPayment =
                                itemsUsersArr[
                                  params.index
                                ].stringItemsRateHashMap[item].irToaccount;
                            }
                          }
                        },
                        "打款查看"
                      )
                    ]);
                  default:
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            marginTop: "10px",
                            display: "block",
                            borderBottom: "1px solid",
                            margin: " 5px 10px",
                            paddingBottom: " 5px"
                          }
                        },
                        this.$util.digitalConversion(
                          itemsUsersArr[params.index].stringItemsRateHashMap[
                            item
                          ].irToaccount
                        )
                      ),
                      h(
                        "Button",
                        {
                          props: {
                            type: "primary",
                            size: "small",
                            disabled: !itemsUsersArr[params.index]
                              .stringItemsRateHashMap[item].aboolean
                          },
                          style: {
                            marginBottom: " 5px"
                          },
                          on: {
                            click: () => {
                              this.moneyTitle = "打款";
                              this.uType = "利息";
                              this.infoForm = params.row;
                              if (!params.row.userBank) {
                                this.infoForm.userBank = {
                                  udBankNumber: "",
                                  udBank: ""
                                };
                              }
                              this.infoForm.irid =
                                itemsUsersArr[
                                  params.index
                                ].stringItemsRateHashMap[item].irId;
                              this.modal1 = true;
                              this.infoForm.actualPayment =
                                itemsUsersArr[
                                  params.index
                                ].stringItemsRateHashMap[item].irToaccount;
                              this.$nextTick(() => {
                                this.uploadList = this.$refs.upload.fileList;
                              });
                            }
                          }
                        },
                        itemsUsersArr[params.index].stringItemsRateHashMap[item]
                          .irRepaymestate == 0
                          ? "打款"
                          : "已失效"
                      )
                    ]);
                }
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
          const irLawday = itemsUsersArr[0].itemsRate.irLawday;
          this.columns.push({
            align: "center",
            title: `本金/${irLawday}`,
            width: 156,
            render: (h, params) => {
              switch (params.row.itemsRate.irRepaymestate) {
                case 1:
                  return h("div", [
                    h(
                      "span",
                      {
                        style: {
                          marginTop: "10px",
                          display: "block",
                          borderBottom: "1px solid",
                          margin: " 5px 10px",
                          paddingBottom: " 5px"
                        }
                      },
                      this.$util.digitalConversion(
                        params.row.itemsRate.irToaccount
                      )
                    ),
                    h(
                      "Button",
                      {
                        props: {
                          type: "success",
                          size: "small"
                        },
                        style: {
                          marginBottom: " 5px",
                          background: "#4bc588"
                        },
                        on: {
                          click: () => {
                            this.moneyTitle = "打款详情";
                            this.uType = "本金";
                            this.infoForm = params.row;
                            this.infoForm.irPaymentvoucher =
                              params.row.itemsRate.irPaymentvoucher;
                            if (!params.row.userBank) {
                              this.infoForm.userBank = {
                                udBankNumber: "",
                                udBank: ""
                              };
                            }
                            this.infoForm.irid = params.row.itemsRate.irId;
                            this.modal1 = true;
                            this.infoForm.actualPayment =
                              params.row.itemsRate.irToaccount;
                          }
                        }
                      },
                      "打款查看"
                    )
                  ]);
                default:
                  return h("div", [
                    h(
                      "span",
                      {
                        style: {
                          marginTop: "10px",
                          display: "block",
                          borderBottom: "1px solid",
                          margin: " 5px 10px",
                          paddingBottom: " 5px"
                        }
                      },
                      this.$util.digitalConversion(
                        params.row.itemsRate.irToaccount
                      )
                    ),
                    h(
                      "Button",
                      {
                        props: {
                          type: "primary",
                          size: "small",
                          disabled: !params.row.itemsRate.aboolean
                        },
                        style: {
                          marginBottom: " 5px"
                        },
                        on: {
                          click: () => {
                            this.moneyTitle = "打款";
                            this.uType = "本金";
                            this.infoForm = params.row;
                            if (!params.row.userBank) {
                              this.infoForm.userBank = {
                                udBankNumber: "",
                                udBank: ""
                              };
                            }
                            this.infoForm.irid = params.row.itemsRate.irId;
                            this.modal1 = true;
                            this.infoForm.actualPayment =
                              params.row.itemsRate.irToaccount;
                            this.$nextTick(() => {
                              this.uploadList = this.$refs.upload.fileList;
                            });
                          }
                        }
                      },
                      "打款"
                    )
                  ]);
              }
            }
          });
          this.data = res.data.result.itemsUsers;
        } else {
          this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    //时间选择
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
.ivu-table td.demo-table-info-column {
  background-color: #2db7f5;
  color: #fff;
}
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