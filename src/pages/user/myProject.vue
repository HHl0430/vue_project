<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>用户</BreadcrumbItem>
      <BreadcrumbItem>我的项目</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Table :columns="columns" :data="data" @on-sort-change="changeSort">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              v-if="row.iuJoinintention == 0 || row.iuJoinintention == 3"
              type="primary"
              size="small"
              @click="showModal(row,'参与项目')"
            >参与项目</Button>
            <Button v-else type="primary" size="small" @click="showModal(row,'查看')">查 看</Button>
          </template>
        </Table>
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
      </div>
    </Card>
    <Modal v-model="modal1" title="参与项目" @on-ok="ok" @on-cancel="cancel" width="900">
      <Form :model="infoForm" :label-width="130">
        <FormItem label="项目名称:">
          <Input :disabled="true" v-model="infoForm.iitemname" placeholder="请输入项目名称"></Input>
        </FormItem>
        <FormItem label="参与金额:">
          <Input :disabled="true" v-model="infoForm.iuJoinitemmoney" placeholder="请输入参与金额"></Input>
        </FormItem>
        <FormItem label="收款开户人:">
          <Input :disabled="true" v-model="infoForm.itemsBank.ibPayee" placeholder="请输入收款开户人"></Input>
        </FormItem>
        <FormItem label="收款银行支行名称:">
          <Input :disabled="true" v-model="infoForm.itemsBank.ibBankBranch" placeholder="请输入收款银行"></Input>
        </FormItem>
        <FormItem label="收款银行账户:">
          <Input :disabled="true" v-model="infoForm.itemsBank.ibBanknumber" placeholder="请输入收款银行账户"></Input>
        </FormItem>
        <FormItem label="利息/本金:">
          <Table max-height="350" :columns="columns1" :data="data1"></Table>
        </FormItem>

        <FormItem label="打款凭证:">
          <div v-if="modalTitle != '查看'">
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
              :disabled="uploadList.length >= 5"
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
              <img id="viewerImg" :src="$store.state.uploadUrl + imgName " style="width: 100%" />
            </viewer>
          </div>
          <div v-if="modalTitle == '查看' && imgUrl !=''">
            <viewer>
              <img
                v-for="item in iuMoneyvoucherList"
                id="viewerImg1"
                :src="$store.state.uploadUrl + item "
              />
            </viewer>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取 消</Button>
        <Button v-if="modalTitle == '参与项目'" type="warning" @click="nonparticipation">不参与</Button>
        <Button v-if="modalTitle == '参与项目'" type="primary" @click="ok">确 认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUserProjectList,
  releaseProject,
  delFile,
  joinProject,
  getUserInfo
} from "@/seavers";
export default {
  data() {
    return {
      orderType: "",
      orderPermu: "",
      total: 0,
      iuMoneyvoucherList: [],
      infoForm: {
        itemsBank: {
          ibBank: "",
          ibBanknumber: "",
          ibPayee: ""
        }
      },
      size: 10,
      page: 1,
      modal1: false,
      imgUrl: "",
      columns1: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "利息/本金",
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
          title: "利息/本金收款日期",
          key: "irLawday",
          minWidth: 100,
          align: "center"
        },
        {
          title: "收款凭证",
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
      columns: [
        {
          align: "center",
          title: "项目名称",
          key: "iitemname",
          minWidth: 100
        },

        {
          align: "center",
          title: "项目利率(月/%)",
          width: 130,
          key: "irate"
        },
        {
          align: "center",
          title: "项目完结状态",
          key: "iitemstate",
          sortable: "custom",
          width: 130,
          render: (h, params) => {
            switch (params.row.iitemstate) {
              case 0:
                return h("span", "未发布");
              case 1:
                return h("span", "进行中");
              case 2:
                return h("span", "已完结");
              case 3:
                return h("span", "调整中");
            }
          }
        },
        {
          align: "center",
          title: "项目开始-结束时间",
          key: "ibegintime",
          sortable: "custom",
          width: 188,
          render: (h, params) => {
            return h("span", params.row.ibegintime + "/" + params.row.iendtime);
          }
        },
        {
          align: "center",
          title: "项目最后收款日期",
          key: "iitemlastdate",
          width: 140
        },
        {
          align: "center",
          title: "项目周期",
          width: 80,
          key: "iitemperiodsday",
          render: (h, params) => {
            return h(
              "span",
              params.row.iitemperiodsType == 0
                ? params.row.iitemperiods + "/" + params.row.iitemperiodsday
                : params.row.iitemperiods
            );
          }
        },
        {
          align: "center",
          title: "参与金额",
          key: "iuJoinitemmoney",
          width: 150,
          render: (h, params) => {
            return h(
              "span",
              this.$util.digitalConversion(params.row.iuJoinitemmoney)
            );
          }
        },
        {
          align: "center",
          title: "金额到账情况",
          key: "iuToaccount",
          width: 110,
          render: (h, params) => {
            switch (params.row.iuToaccount) {
              case 0:
                return h(
                  "span",
                  params.row.iuJoinintention == 1
                    ? "已打款未确认"
                    : `未打款${params.row.iuJoinintention == 2 ? "(已退)" : ""}`
                );
              case 1:
                return h(
                  "span",
                  `已打款${params.row.iuJoinintention == 2 ? "(已退)" : ""}`
                );
            }
          }
        },

        {
          title: "操作",
          slot: "action",
          width: 100,
          align: "center"
        }
      ],
      headers: {
        enctype: "multipart/form-data",
        "Admin-Token": window.localStorage
          .getItem("Token")
          .replace('"', "")
          .replace('"', "")
      },
      data: [],
      data1: [],
      defaultList: [],
      imgName: "",
      uploadList: []
    };
  },
  created() {
    this.getTableList();
  },
  mounted() {},
  methods: {
    currentPage(val) {
      this.page = val;
      this.getTableList();
    },
    //排序
    changeSort(a) {
      this.orderType = a.order;
      this.orderPermu = a.column.key;
      this.getTableList({ orderType: a.order, orderPermu: a.column.key });
    },
    handleView(name) {
      this.imgName = name;
      document.getElementById("viewerImg").click();
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      delFile({ url: file.response.result }).then(res => {});
    },
    handleSuccess(res, file) {
      file.url = this.$store.state.uploadUrl + res.result;
      file.name = res.result;
    },
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
    showModal(row, title) {
      this.modalTitle = title;
      if (
        title == "查看" &&
        row.iuMoneyvoucherList != [] &&
        row.iuMoneyvoucherList != null
      ) {
        this.iuMoneyvoucherList = row.iuMoneyvoucherList;
        this.imgUrl = row.iuMoneyvoucherList[0];
      } else {
        this.$nextTick(() => {
          this.uploadList = this.$refs.upload.fileList;
        });
      }
      this.infoForm = row;
      this.infoForm.iuJoinitemmoney = this.$util.digitalConversion(
        this.infoForm.iuJoinitemmoney
      );

      getUserInfo({ iriuId: row.iriuId }).then(res => {
        if (res.data.code == 200) {
          this.data1 = res.data.result;
        } else {
          this.$Message.destroy();
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
      this.modal1 = true;
    },
    nonparticipation() {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认不参与？</p>",
        onOk: () => {
          this.joinPro("3");
        },
        onCancel: () => {}
      });
    },
    ok() {
      this.$Modal.confirm({
        title: "提示",
        content: "<p style='margin-top: 5px;'>确认参与项目？</p>",
        onOk: () => {
          this.joinPro("1");
        },
        onCancel: () => {}
      });
    },
    joinPro(iuJoinintention) {
      var obj = {
        iuJoinintention,
        iuId: this.infoForm.iriuId,
        iuMoneyvoucherList: []
      };
      if (this.uploadList.length > 0 && iuJoinintention == 1) {
        this.uploadList.forEach(item => {
          obj.iuMoneyvoucherList.push(item.response.result);
        });
      } else {
        obj.iuMoneyvoucherList = [];
      }
      if (obj.iuMoneyvoucherList.length < 1) {
        this.$Message.warning({
          background: true,
          content: "请上传打款凭证"
        });
        return
      }
      joinProject(obj).then(res => {
        this.modal1 = false;
        if (res.data.code == 200) {
          this.$Message.success({
            background: true,
            content: "操作成功"
          });
          this.$refs.upload.fileList.splice(0, 1);
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
    cancel() {
      this.modal1 = false;
      if (this.modalTitle != "查看") {
        this.$refs.upload.fileList.splice(0, 1);
      } else {
        this.imgUrl = "";
      }
    },
    getTableList(ele) {
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
      getUserProjectList(obj).then(res => {
        if (res.data.code == 200) {
          this.total = res.data.result.count;
          this.data = res.data.result.data;
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
