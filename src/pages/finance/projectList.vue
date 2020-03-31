<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>财务</BreadcrumbItem>
      <BreadcrumbItem>项目列表</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formInline" :model="form" inline :label-width="100">
          <Row>
            <Col :span="20" style="text-align: center">
              <FormItem prop="iitemname" label="项目名称:">
                <Input type="text" v-model="form.iitemname" placeholder="请输入"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="search">search</Button>
              </FormItem>
            </Col>
            <Col :span="4"></Col>
          </Row>
        </Form>
      </div>
      <div>
        <Table :columns="columns" :data="data" @on-sort-change="changeSort">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="info" size="small" @click="viewInfo(row.iid)">详 情</Button>
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
  </div>
</template>

<script>
import { getMyProjectList } from "@/seavers";
import  columnList  from "./finance.js";

export default {
  data() {
    return {
      orderType: "",
      orderPermu: "",
      size: 10,
      page: 1,
      total: 0,
      columns: columnList.financeListColumns,
      form: {
        iitemname: ""
      },

      data: []
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    //排序
    changeSort(a) {
      this.orderType = a.order;
      this.orderPermu = a.column.key;
      this.getTableList({ orderType: a.order, orderPermu: a.column.key });
    },
    viewInfo(iid) {
      this.$router.push({
        path: "/finance/projectListDetail",
        query: {
          iid
        }
      });
    },

    search() {
      this.page = 1;
      this.getTableList();
    },
    currentPage(val) {
      this.page = val;
      this.getTableList();
    },
    getTableList(ele) {
      let obj = {
        page: this.page,
        size: this.size,
        orderType: this.orderType,
        orderPermu: this.orderPermu,
        iitemname: this.form.iitemname
      };
      if (ele) {
        obj.orderPermu = ele.orderPermu;
        obj.orderType = ele.orderType;
      }
      getMyProjectList(obj).then(res => {
        if (res.data.code == 200) {
          this.data = res.data.result.data;
          this.total = res.data.result.count;
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