<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>平台</BreadcrumbItem>
      <BreadcrumbItem to="/platform/platformMyProject">我的项目</BreadcrumbItem>
      <BreadcrumbItem>修改</BreadcrumbItem>
      <Button
        style="float: right;margin-right: 20px"
        type="primary"
        @click="$router.push('/platform/platformMyProject')"
        size="small"
      >返回</Button>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formObj" :model="formObj" :label-width="180" :rules="ruleInline">
          <Row>
            <Divider style="font-weight: 700;color: #a9a906;" orientation="left">项目基本信息</Divider>
          </Row>
          <Row>
            <Col span="10">
              <FormItem prop="iitemname" label="项目名称:">
                <Input maxlength="50" type="text" v-model="formObj.iitemname" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目介绍:" prop="iiteminfo">
                <Input
                  maxlength="255"
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
                  maxlength="11"
                  type="text"
                  v-model="formObj.igatheringmoney"
                  placeholder="请输入"
                ></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目利率(月):" prop="irate">
                <Input maxlength="5" type="text" v-model="formObj.irate" placeholder="请输入">
                  <span slot="append">%</span>
                </Input>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10">
              <FormItem label="项目期数:" prop="iitemperiods">
                <Input maxlength="2" type="text" v-model="formObj.iitemperiods" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="周期单位:" prop="radio">
                <RadioGroup v-model="formObj.radio">
                  <Radio label="按日计息"></Radio>
                  <Radio label="按月计息"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="项目每期天数:" v-if="formObj.radio == '按日计息'">
                <Input
                  maxlength="3"
                  type="text"
                  v-model="formObj.iitemperiodsday"
                  placeholder="请输入"
                ></Input>
              </FormItem>
              <FormItem label="打款日期:" v-if="formObj.radio == '按月计息'">
                <Input
                  maxlength="2"
                  type="text"
                  @on-change="numChange"
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
                <Input maxlength="50" type="text" v-model="formObj.ibBank" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="收款银行账户:" prop="ibBanknumber">
                <Input maxlength="20" type="text" v-model="formObj.ibBanknumber" placeholder="请输入"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="收款开户人姓名:" prop="ibPayee">
                <Input maxlength="20" type="text" v-model="formObj.ibPayee" placeholder="请输入"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Divider style="font-weight: 700;color: #a9a906;" orientation="left">参与用户基本信息</Divider>
          </Row>
          <Row>
            <div style="float: left;">
              <FormItem label="参与用户:" prop="userList">
                <Transfer
                  :data="user"
                  :target-keys="userRight"
                  filterable
                  :filter-method="filterMethod"
                  @on-change="handleChange2"
                ></Transfer>
              </FormItem>
            </div>
            <div style="width: calc(100% - 770px);display: inline-block; margin-left: 20px;">
              <table class="table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>
                      缴纳金额
                      <br />
                      (总金额：{{$util.digitalConversion(formObj.igatheringmoney) }},剩余金额：{{$util.digitalConversion(monery)}})
                    </th>
                  </tr>
                </thead>
              </table>
              <div style="max-height: 160px;overflow: auto;">
                <table class="table">
                  <tbody>
                    <tr v-for="(item,index) in userListAll" :key="index">
                      <td align="center" height="39px">{{item.userName}}</td>
                      <td align="center">
                        <input
                          maxlength="11"
                          class="table-input"
                          v-model="item.iuJoinitemmoney"
                          oninput="value=value.replace(/[^0-9]/g,'')"
                          @blur="blur($event,item.userName)"
                          type="text"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Row>
          <Row>
            <Col span="24" style="text-align: center;">
              <FormItem :label-width="0">
                <Button type="primary" @click="submit">Submit</Button>
                <Button @click="handleReset('formObj')" style="margin-left: 8px">Reset</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import { getUserList, setProject, getMyProjectDetails } from "@/seavers";
export default {
  data() {
    return {
      formObj: {
        iitemname: "",
        iiteminfo: "",
        time: "",
        ibegintime: "",
        iendtime: "",
        igatheringmoney: "",
        radio: "按月计息",
        iitemlastdate: "",
        iitemlastdateA: "",
        irate: "",
        iitemperiods: "",
        iitemperiodsday: "",
        userList: []
      },
      monery: 0,
      userListAll: [],
      userRight: [],
      user: [],
      ruleInline: {
        iitemname: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "blur"
          }
        ],
        iiteminfo: [
          {
            required: true,
            message: "请输入项目介绍",
            trigger: "blur"
          }
        ],
        igatheringmoney: [
          {
            required: true,
            message: "请输入筹资金额",
            trigger: "blur"
          },
          {
            message: "筹资金额只能是数字",
            trigger: "blur",
            pattern: /^\d*\.{0,1}\d{0,1}$/
          }
        ],

        irate: [
          {
            required: true,
            message: "请输入项目利率",
            trigger: "blur"
          },
          {
            message: "项目利率只能是数字",
            trigger: "blur",
            pattern: /^\d*\.{0,1}\d{0,4}$/
          }
        ],
        iitemperiods: [
          {
            required: true,
            message: "请输入项目期数",
            trigger: "blur"
          },
          {
            message: "项目期数只能是数字",
            trigger: "blur",
            pattern: /^\d*\.{0,1}\d{0,1}$/
          }
        ],
        iitemperiodsday: [
          {
            required: true,
            message: "请输入每期天数",
            trigger: "blur"
          },
          {
            message: "每期天数只能是数字",
            trigger: "blur",
            pattern: /^\d*\.{0,1}\d{0,1}$/
          }
        ],
        ibBanknumber: [
          {
            required: true,
            message: "请输入银行账户",
            trigger: "blur"
          },
          {
            message: "请输入正确的银行账户",
            trigger: "blur",
            pattern: /([\d]{4})([\d]{4})([\d]{4})([\d]{4})([\d]{0,})?/
          }
        ],
        ibPayee: [
          {
            required: true,
            message: "请输入开户人姓名",
            trigger: "blur"
          }
        ],
        ibBanknumber: [
          {
            required: true,
            message: "请输入银行名称",
            trigger: "blur"
          }
        ],
        time: [
          {
            type: "array",
            required: true,
            fields: {
              0: {
                type: "date",
                required: true,
                message: "请选择日期",
                trigger: "blur"
              },
              1: {
                type: "date",
                required: true,
                message: "请选择日期",
                trigger: "blur"
              }
            }
          }
        ],
        iitemlastdate: [
          {
            required: true,
            message: "请选择筹资结束日期",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getUser();
    this.getProjectInfo();
  },
  methods: {
    blur(event, name) {
      let num = 0;
      this.userListAll.forEach(item => {
        if (name == item.userName) {
          if (+event.target.value > +item.unUsedQuota) {
            this.$Message.warning({
              content: item.userName + "超出可使用额度",
              duration: 3
            });
          }
        }
        item.iuJoinitemmoney == ""
          ? (num += 0)
          : (num += +item.iuJoinitemmoney);
      });
      this.monery = this.formObj.igatheringmoney - num;
    },
    radioChange(e) {},
    numChange() {
      if (
        +this.formObj.iitemperiodsMonth < 0 ||
        +this.formObj.iitemperiodsMonth > 31
      ) {
        this.formObj.iitemperiodsMonth = 1;
      }
    },
    getProjectInfo() {
      getMyProjectDetails({ itemsId: this.$route.query.iid }).then(res => {
        if (res.data.code == 200) {
          this.formObj = { ...this.formObj, ...res.data.result };
          this.formObj.igatheringmoney = String(
            res.data.result.igatheringmoney
          );
          this.formObj.iitemperiodsday = res.data.result.iitemperiodsday;
          if (this.formObj.iitemperiodsType == 1) {
            this.formObj.radio = "按月计息";
          } else {
            this.formObj.radio = "按日计息";
          }
          this.formObj.iitemperiods = String(res.data.result.iitemperiods);
          this.formObj.irate = String(res.data.result.irate);
          this.formObj.iitemlastdateA = res.data.result.iitemlastdate;
          this.formObj.time = [
            res.data.result.ibegintime,
            res.data.result.iendtime
          ];
          const arr = [];
          res.data.result.itemsUsers.forEach(item => {
            this.userRight.push(item.iuUserid);
            let obj = {
              iuJoinitemmoney: item.iuJoinitemmoney,
              iuUserid: item.iuUserid,
              userName: item.uname
            };
            arr.push(obj);
          });
          this.formObj.userList = arr;
          this.handleChange2();
        } else {
           this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    //移动时
    handleChange2(newTargetKeys) {
      if (newTargetKeys) {
        this.userRight = newTargetKeys;
      }
      var arr = [];
      this.userRight.forEach(item => {
        //a: 从已知用户中获取对应的用户名
        let a = this.user.filter(item1 => {
          return item == item1.key;
        });
        //obj: 用来存储当前item 包含 iuUserid userName iuJoinitemmoney
        let obj = {};
        obj.iuUserid = a[0].key;
        obj.userName = a[0].label;
        obj.unUsedQuota = a[0].unUsedQuota;
        if (this.formObj.userList.length > 0) {
          //b: 判断是否有填写金额，如果有就直接将b[0].iuJoinitemmoney 赋值给obj
          let b = this.formObj.userList.filter(item2 => {
            return item == item2.iuUserid;
          });
          if (b.length > 0) {
            obj.iuJoinitemmoney = b[0].iuJoinitemmoney;
          } else {
            //如果没有输入金额则设置默认值''
            obj.iuJoinitemmoney = "";
          }
        } else {
          //初始化设置默认值为''
          obj.iuJoinitemmoney = "";
        }
        arr.push(obj);
      });
      this.userListAll = arr;
      this.formObj.userList = this.userListAll;
      this.blur();
    },
    //筛选
    filterMethod(data, query) {
      return data.label.indexOf(query) > -1 || data.key.indexOf(query) > -1;
    },
    getUser() {
      getUserList().then(res => {
        if (res.data.code == 200) {
          res.data.result.forEach(item => {
            item.label =
              item.label + "(" + this.$util.digitalConversion(item.unUsedQuota) + ")";
          });
          this.user = res.data.result;
        } else {
           this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.formObj.userList = [];
      this.userListAll = [];
      this.userRight = [];
    },
    proDate(date) {
      this.formObj.ibegintime = date[0];
      this.formObj.iendtime = date[1];
    },
    lastProDate(date) {
      this.formObj.iitemlastdate = date;
      this.formObj.iitemlastdateA = date;
    },
    submit() {
      this.formObj.iitemlastdate = this.formObj.iitemlastdateA;
      this.userListAll.forEach((item, index) => {
        this.formObj.userList[index] = item;
      });
      //校验是否选择用户
      if (this.formObj.userList.length > 0) {
        let a = this.formObj.userList.filter(item => {
          return item.iuJoinitemmoney == "";
        });
        var count = 0;
        this.formObj.userList.forEach(item => {
          count += +item.iuJoinitemmoney;
        });
        if (this.formObj.igatheringmoney != count) {
          this.$Message.warning({
            background: true,
            content: "筹资金额必须要与用户缴纳总金额相等"
          });
          return;
        }
        if (a.length > 0) {
          this.$Message.error({
            background: true,
            content: "请输入用户需缴纳的金额"
          });
          return;
        }
      } else {
        this.$Message.error({
          background: true,
          content: "请选择用户"
        });
        return;
      }
      if (this.formObj.radio == "按月计息") {
        this.formObj.iitemperiodsType = 1;
        if (this.formObj.iitemperiodsMonth == "") {
          this.$Message.error({
            background: true,
            content: "请输入打款日期"
          });
          return;
        }
      } else {
        this.formObj.iitemperiodsType = 0;
      }
      this.$refs.formObj.validate(valid => {
        if (valid) {
          this.formObj.iid = this.$route.query.iid;
          setProject(this.formObj).then(res => {
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: "修改成功"
              });
              this.$router.push({
                path: "/platform/platformMyProject"
              });
            } else {
               this.$Message.destroy();
              this.$Message.error({
                background: true,
                content: res.data.message
              });
            }
          });
        } else {
          this.$Message.warning({
            background: true,
            content: "请输入必填项"
          });
        }
      });
    }
  }
};
</script>

<style>
.ivu-input-wrapper {
  width: 90%;
}
.table {
  width: 100%;
  table-layout: fixed;
}
.table thead tr {
  background-color: #f8f8f9;
  color: #515a6e;
  font-size: 14px;
  border-bottom: 1px solid #e8eaec;
}
.table thead tr th {
  width: 30%;
  height: 39px;
  font-weight: 700;
}
.table tbody td {
  border-bottom: 1px solid #e8eaec;
}
.table-input {
  display: inline-block;
  width: 90%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}
.table-input:hover {
  border-color: #57a3f3;
}
</style>