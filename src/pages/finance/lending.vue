<template>
  <div class="page">
    <Breadcrumb style="    height: 30px;margin-top: 14px;margin-left: 20px;line-height: 30px;">
      <BreadcrumbItem>财务</BreadcrumbItem>
      <BreadcrumbItem>放款管理</BreadcrumbItem>
    </Breadcrumb>
    <Card style="margin: 10px;min-height:calc(100% - 75px)">
      <div>
        <Form ref="formInline" :model="form" inline :label-width="140">
          <Row>
            <Col :span="20" style="text-align: center">
              <!-- <FormItem prop="name" label="客户名称:">
                <Input type="text" v-model="form.name" placeholder="请输入"></Input>
              </FormItem>-->
              <FormItem label="项目开始-结束日期:" prop="time">
                <DatePicker
                  type="daterange"
                  @on-change="proDate"
                  v-model="form.time"
                  placement="bottom-end"
                  placeholder="Select date"
                  style="width: 100%"
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
      <div>
        <Table :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              :disabled="row.itemsRate.irRepaymestate == 1"
              type="primary"
              size="small"
              @click="showModal(row)"
            >打 款</Button>
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

    <Modal v-model="modal1" title="打款" @on-ok="ok" @on-cancel="cancel">
      <Form :model="infoForm" :label-width="130">
        <FormItem label="用户名称:">
          <Input :disabled="true" v-model="infoForm.user.uname" placeholder="请输入用户名称"></Input>
        </FormItem>
        <FormItem label="打款金额:">
          <Input :disabled="true" v-model="infoForm.itemsRate.irToaccount" placeholder="请输入打款金额"></Input>
        </FormItem>
        <FormItem label="打款开户账号:">
          <Input :disabled="true" v-model="infoForm.userBank.udBankNumber" placeholder="请输入打款开户账号"></Input>
        </FormItem>
        <FormItem label="打款银行名称:">
          <Input :disabled="true" v-model="infoForm.userBank.udBank" placeholder="请输入打款银行名称"></Input>
        </FormItem>
        <FormItem label="打款凭证:">
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
            :disabled="uploadList.length >= 1"
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
import { getLendingData, sureLending, delFile } from "@/seavers";
import { lendingColumns } from "./finance.js";
export default {
  data() {
    return {
      size: 10,
      page: 1,
      total: 0,
      headers: {
        enctype: "multipart/form-data",
        "Admin-Token": window.localStorage.getItem("Token")
      },
      infoForm: {
        user: {
          uname: ""
        },
        userBank: {
          udBank: "",
          udBankNumber: ""
        },
        itemsRate: {
          irToaccount: ""
        }
      },
      form: {
        iitemname: "",
        name: "",
        beginTime: "",
        engTime: "",
        time: []
      },
      modal1: false,
      columns: lendingColumns,
      imgName: "",
      uploadList: [],
      defaultList: [],
      data: []
    };
  },
  created() {
    this.form.time = [this.getDay(0), this.getDay(7)];
    this.form.beginTime = this.getDay(0);
    this.form.engTime = this.getDay(7);
    this.getTableList();
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
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
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
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
          obj.irId = this.infoForm.itemsRate.irId;
          sureLending(obj).then(res => {
            this.modal1 = false;
            if (res.data.code == 200) {
              this.$Message.success({
                background: true,
                content: "确认打款成功"
              });
              this.$refs.upload.fileList.splice(0, 1);
              this.getTableList();
            }
          });
        },
        onCancel: () => {}
      });
    },
    cancel() {
      this.modal1 = false;
      this.$refs.upload.fileList.splice(0, 1);
    },

    showModal(row) {
      this.infoForm = row;
      if (row.userBank == null) {
        this.infoForm.userBank = {
          udBank: "",
          udBankNumber: ""
        };
      }
      this.modal1 = true;
    },
    getDay(day) {
      var today = new Date();

      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

      today.setTime(targetday_milliseconds); //注意，这行是关键代码

      var tYear = today.getFullYear();

      var tMonth = today.getMonth();

      var tDate = today.getDate();

      tMonth = this.doHandleMonth(tMonth + 1);

      tDate = this.doHandleMonth(tDate);

      return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth(month) {
      var m = month;

      if (month.toString().length == 1) {
        m = "0" + month;
      }

      return m;
    },
    proDate(date) {
      this.form.beginTime = date[0];
      this.form.engTime = date[1];
    },

    search() {
      this.page = 1;
      this.getTableList();
    },
    currentPage(val) {
      this.page = val;
      this.getTableList();
    },
    getTableList() {
      getLendingData(this.form).then(res => {
        if (res.data.code == 200) {
          this.data = res.data.result;
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
</style>