<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>平台</BreadcrumbItem>
      <BreadcrumbItem>我的项目</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formInline" :model="form" inline :label-width="100">
          <Row>
            <Col :span="20" style="text-align: center">
              <FormItem prop="iitemname" label="项目名称:">
                <Input type="text" v-model="form.iitemname" placeholder="请输入"></Input>
              </FormItem>
              <FormItem prop="iitemstate" label="项目状态:">
                <Select v-model="form.iitemstate" style="width: 169px;text-align: left">
                  <Option value="4" key="4">全部</Option>
                  <Option value="0" key="0">未发布</Option>
                  <Option value="1" key="1">进行中</Option>
                  <Option value="2" key="2">已完结</Option>
                  <Option value="3" key="3">已撤回</Option>
                </Select>
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
            <Button
              type="error"
              v-if="row.iitemstate != 1 && row.iitemstate != 2"
              size="small"
              @click="setInfo(row)"
            >修 改</Button>
            <Button
              v-if="row.iitemstate != 1 && row.iitemstate != 2"
              type="primary"
              size="small"
              @click="sure(row)"
            >发 布</Button>
            <Button
              v-if="row.iitemstate == 1 ||  row.iitemstate == 2"
              type="info"
              size="small"
              @click="viewInfo(row.iid)"
            >详 情</Button>
            <Button
              v-if="row.iitemstate == 1 && row.isRecall"
              type="error"
              size="small"
              @click="recall(row.iid)"
            >撤 回</Button>
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
    <div>
      <Modal v-model="modal" title="发布项目">
        <Form ref="formObj" :model="formObj" :label-width="110">
          <FormItem label="项目名称:">
            <Input :disabled="true" type="text" v-model="formObj.iitemname" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="需要筹资金额:">
            <Input :disabled="true" type="text" v-model="formObj.igatheringmoney" placeholder="请输入"></Input>
          </FormItem>
        </Form>
        <Checkbox style="margin-left: 10px;" v-model="confirmSend">是否发送短信</Checkbox>
        <div slot="footer">
          <Button @click="modal = false">取 消</Button>
          <Button type="primary" @click="release()">确认发布</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { getMyProjectList, releaseProject, recallProject } from "@/seavers";
import columnList from "./platForm";
export default {
  data() {
    return {
      formObj: {
        iitemname: "",
        igatheringmoney: ""
      },
      orderType: "",
      confirmSend: false,
      iid: "",
      modal: false,
      orderPermu: "",
      size: 10,
      page: 1,
      total: 0,
      columns: columnList.projectListColumns,
      form: {
        iitemname: "",
        iitemstate: "4"
      },

      data: []
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    sure(row) {
      this.modal = true;
      this.iid = row.iid;
      this.formObj = row;
      this.formObj.igatheringmoney = this.$util.digitalConversion(
        this.formObj.igatheringmoney
      );
    },

    //排序
    changeSort(a) {
      this.orderType = a.order;
      this.orderPermu = a.column.key;
      this.getTableList({ orderType: a.order, orderPermu: a.column.key });
    },
    recall(itemsId) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认撤回？</p>",
        onOk: () => {
          recallProject({ itemsId }).then(res => {
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: "撤回成功"
              });
              this.getTableList();
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
    release() {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认发布？</p>",
        onOk: () => {
          releaseProject({
            itemsId: this.iid,
            confirmSend: this.confirmSend ? "1" : "0"
          }).then(res => {
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: "发布成功"
              });
              this.modal = false;
              this.getTableList();
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
    viewInfo(iid) {
      this.$router.push({
        path: "/platform/projectDetail",
        query: {
          iid
        }
      });
    },
    setInfo(row) {
      this.$router.push({
        path: "/platform/setMyProject",
        query: {
          iid: row.iid
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
        iitemname: this.form.iitemname,
        iitemstate: +this.form.iitemstate
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