<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>查询统计</BreadcrumbItem>
      <BreadcrumbItem>项目统计</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formInline" :model="form" inline :label-width="100">
          <Row>
            <Col :span="20" style="text-align: center">
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
import { getCharts, selectFuzzyOfYear } from "@/seavers";
export default {
  data() {
    return {
      columns: [],
      form: {
        beginTime: "",
        endTime: "",
        userName: ""
      },
      columns1: [],
      data1: [],
      modal: false,
      modal1: false,
      permissions: localStorage.getItem("permissions"),
      data: []
    };
  },
  created() {
    this.getChartsData();
    this.pushColumns();
  },
  mounted() {
    let newDate = new Date().getFullYear() + "";
    this.form.beginTime = newDate;
    this.form.endTime = newDate;
  },
  methods: {
    pushColumns() {
      if (this.permissions == 1) {
        this.columns = [
          {
            title: "年份",
            align: "center",
            key: "statisticalYear"
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
                      selectFuzzyOfYear({
                        years: params.row.statisticalYear
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
          {
            title: "项目总金额",
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
            title: "金额总计",
            align: "center",
            key: "totalOfamount",
            render: (h, params) => {
              return h(
                "span",
                this.$util.digitalConversion(params.row.totalOfamount)
              );
            }
          }
        ];
        this.columns1 = [
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
                          query: {
                            iid: params.row.iid,
                            iriuId: params.row.itemsUsers[0].itemsRate.irIuid
                          }
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
          }
        ];
      } else {
        this.columns = [
          {
            title: "年份",
            align: "center",
            key: "statisticalYear"
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
                      selectFuzzyOfYear({
                        years: params.row.statisticalYear
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
          {
            title: "项目总金额",
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
            title: "金额总计",
            align: "center",
            key: "totalOfamount",
            render: (h, params) => {
              return h(
                "span",
                this.$util.digitalConversion(params.row.totalOfamount)
              );
            }
          },
          {
            title: "参与总人数",
            align: "center",
            key: "totalPeople"
          }
        ];
        this.columns1 = [
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
                          query: {
                            iid: params.row.iid,
                            iriuId: params.row.itemsUsers[0].itemsRate.irIuid
                          }
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
            key: "iuJoinintentionSum",
            render: (h, params) => {
              return h(
                "span",
                params.row.itemsUsers.length
              );
            }
          }
        ];
      }
    },
    starYearChange(date) {
      this.form.beginTime = date;
      if (
        +this.form.endTime < +this.form.beginTime &&
        this.form.endTime !== ""
      ) {
        this.$Message.warning({
          content: "截至日期不可低于起始日期",
          duration: 3
        });
      }
    },
    endYearChange(date) {
      this.form.endTime = date;
      if (
        +this.form.endTime < +this.form.beginTime &&
        this.form.beginTime !== ""
      ) {
        this.$Message.warning({
          content: "截至日期不可低于起始日期",
          duration: 3
        });
      }
    },
    search() {
      if (+this.form.endTime < +this.form.beginTime) {
        this.$Message.warning({
          content: "截至日期不可低于起始日期",
          duration: 3
        });
      } else {
        this.getChartsData();
      }
    },
    cancel() {
      this.modal = false;
    },
    cancel1() {
      this.modal1 = false;
    },
    getChartsData() {
      getCharts(this.form).then(res => {
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
          if (index === 1 || index === 5) {
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