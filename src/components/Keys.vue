<template>
  <div>
    <el-container>
      <el-main>
        <el-page-header @back="goBack" content="Keys详情"> </el-page-header>

        <p>Keys from {{ fileName }}</p>

        <el-table :data="keys" stripe border>
          <el-table-column prop="key" label="Key Name" />
          <el-table-column prop="val" label="Value" />
          <el-table-column
            prop="expiredTimeStr"
            empty-text="Never"
            label="Expire Time "
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="dialogVisible = true"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="提示"
          v-model="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <span>这是一段信息</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false"
                >确 定</el-button
              >
            </span>
          </template>
        </el-dialog>

        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="changePage"
        >
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import request from "../util/request";
import apis from "../../config/apis";

export default {
  data() {
    return {
      keys: [],
      dialogVisible: false,
      fileName: "",
      page: "1",
      pageSize: "10",
      total: 1000,
      keyRangeStart: "",
    };
  },
  methods: {
    goBack() {
      window.history.go(-1);
    },
    handleUpdate(index, row) {
      console.log("update");
      this.dialogVisible = true;
    },
    handleClose(index, row) {
      console.log("handleClose");
    },

    handleDelete(index, row) {
      this.$confirm("是否确定删除 Key: " + row.key, "确认删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "放弃",
      })
        .then(() => {
          request.post({
            url: apis.deleleKey,
            data: {
              key: row.key,
            },
            callback: (rsp) => {
              console.log(rsp);
              this.$message({
                type: "info",
                message: "Delete Successfully",
              });
            },
          });
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message:
              action === "cancel" ? "放弃保存并离开页面" : "停留在当前页面",
          });
        });
    },
    changePage(newPage) {
      this.page = newPage;

      request.get({
        url: apis.fileKeysDetail,
        data: {
          file: this.fileName,
          page: this.page,
          pageSize: this.pageSize,
          keyRangeStart: this.keyRangeStart,
        },
        callback: (rsp) => {
          this.keys = rsp.data.keys;
          this.total = rsp.data.total;
          this.keys.forEach((e) => {
            e.expiredTimeStr =
              e.expiredTime === -1 ? "永久" : new Date(e.expiredTime).toJSON();
          });
        },
      });
    },
  },
  created() {
    this.fileName = this.$route.query.file;
    this.keyRangeStart = this.$route.query.keyRangeStart;

    request.get({
      url: apis.fileKeysDetail,
      data: {
        file: this.fileName,
        page: this.page,
        pageSize: this.pageSize,
        keyRangeStart: this.keyRangeStart,
      },
      callback: (rsp) => {
        this.keys = rsp.data.keys;
        this.keys.forEach((e) => {
          e.expiredTimeStr =
            e.expiredTime === -1 ? "永久" : new Date(e.expiredTime).toJSON();
        });
        this.total = rsp.data.total;
      },
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  display: inline-flex;
  margin: bottom 20rpx;
  color: #777;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
