<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>查询统计</BreadcrumbItem>
      <BreadcrumbItem>用户统计</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formInline" :model="form" inline :label-width="100">
          <Row>
            <Col :span="20" style="text-align: center">
              <FormItem prop="iitemname" label="用户名称:">
                <Input type="text" v-model="form.userName" placeholder="请输入"></Input>
              </FormItem>
              <FormItem prop="iitemname" label="起始年份:">
                <DatePicker
                  type="year"
                  :value="form.beginTime"
                  format="yyyy"
                  @on-change="starYearChange"
                  placeholder="Select year"
                  style="width: 200px"
                ></DatePicker>~
                <DatePicker
                  :value="form.endTime"
                  type="year"
                  format="yyyy"
                  @on-change="endYearChange"
                  placeholder="Select year"
                  style="width: 200px"
                ></DatePicker>
              </FormItem>

              <FormItem>
                <Button type="primary" @click="search">search</Button>
              </FormItem>
            </Col>
            <Col :span="4"></Col>
          </Row>
        </Form>
      </div>

      <Table :columns="columns" :data="data" show-summary :summary-method="handleSummary"></Table>
    </Card>
    <Modal v-model="modal" title="项目" @on-cancel="cancel">
      <Table :columns="columns1" :data="data1"></Table>
      <div slot="footer">
        <Button @click="cancel">取 消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getByUserYears, getUserStatistics } from "@/seavers";
export default {
  data() {
    return {
      columns: [
        {
          title: "用户",
          align: "center",
          key: "statisticalYear",
          render: (h, params) => {
            return h("span", params.row.user.uname);
          }
        },
        {
          title: "项目数量",
          align: "center",
          key: "itemsNumber",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#2d8cf0",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    getByUserYears({
                      beginTime: params.row.beginTime,
                      endTime: params.row.endTime,
                      userId: params.row.user.uid
                    }).then(res => {
                      if (res.data.code == 200) {
                        this.data1 = res.data.result;
                      }
                    });
                    this.modal = true;
                  }
                }
              },
              params.row.itemsNumber
            );
          }
        },
           {
          title: "参与项目金额",
          align: "center",
          key: "totalOfCollection",
          render: (h, params) => {
            return h(
              "span",
              this.$util.digitalConversion(params.row.totalOfCollection)
            );
          }
        },
        {
          title: "利息总计",
          align: "center",
          key: "totalOfPayment",
          render: (h, params) => {
            return h(
              "span",
              this.$util.digitalConversion(params.row.totalOfPayment)
            );
          }
        },
     
      ],
      columns1: [
        {
          title: "项目名称",
          align: "center",
          key: "iitemname",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#2d8cf0",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    if (window.localStorage.getItem("permissions") == 0) {
                      let routeData = this.$router.resolve({
                        path: "/platform/projectDetail",
                        query: { iid: params.row.iid }
                      });
                      window.open(routeData.href, "_blank");
                    } else if (
                      window.localStorage.getItem("permissions") == 2
                    ) {
                      let routeData = this.$router.resolve({
                        path: "/finance/projectListDetail",
                        query: { iid: params.row.iid }
                      });

                      window.open(routeData.href, "_blank");
                    } else {
                      let routeData = this.$router.resolve({
                        path: "/user/userProjectDetail",
                        query: { iid: params.row.iid }
                      });

                      window.open(routeData.href, "_blank");
                    }
                  }
                }
              },
              params.row.iitemname
            );
          }
        },
        {
          title: "金额",
          align: "center",
          key: "igatheringmoney",
          render: (h, params) => {
            return h(
              "span",
              this.$util.digitalConversion(params.row.igatheringmoney)
            );
          }
        },
        {
          title: "参与人数",
          align: "center",
          key: "iuJoinintentionSum"
        }
      ],
      form: {
        beginTime: "",
        endTime: "",
        userName: ""
      },
      data1: [],
      modal: false,
      modal1: false,
      data: []
    };
  },
  created() {
    this.getChartsData();
  },
  mounted() {
    let newDate = new Date().getFullYear() + "";
    this.form.beginTime = newDate;
    this.form.endTime = newDate;
  },
  methods: {
    search() {
      this.getChartsData();
    },
    starYearChange(date) {
      this.form.beginTime = date;
      if (+this.form.endTime < +this.form.beginTime) {
        this.$Message.warning({
          content: "截至日期不可低于起始日期",
          duration: 3
        });
      }
    },
    endYearChange(date) {
      this.form.endTime = date;
      if (+this.form.endTime < +this.form.beginTime) {
        this.$Message.warning({
          content: "截至日期不可低于起始日期",
          duration: 3
        });
      }
    },
    cancel() {
      this.modal = false;
    },
    cancel1() {
      this.modal1 = false;
    },
    getChartsData() {
      getUserStatistics(this.form).then(res => {
        if (res.data.code == 200) {
          this.data = res.data.result;
        }
      });
    },
    handleSummary({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计"
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (!values.every(value => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index === 1 || index === 4) {
            sums[key] = {
              key,
              value: v + " 个"
            };
          } else {
            sums[key] = {
              key,
              value: this.$util.digitalConversion(v) + " 元"
            };
          }
        } else {
          sums[key] = {
            key,
            value: ""
          };
        }
      });

      return sums;
    }
  }
};
</script>

<style>
</style>