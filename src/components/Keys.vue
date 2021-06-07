<template>
  <div>
    <el-page-header @back="goBack" content="Keys详情"> </el-page-header>

    <p>Keys from {{ fileName }}</p>

    <el-table :data="keys" stripe border>
      <el-table-column prop="key" label="Key Name" />
      <el-table-column prop="val" label="Value" />
      <el-table-column
        prop="expiredTime"
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
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
import request from "../util/request";
import apis from "../../config/apis";

export default {
  data() {
    return {
      keys: [],
      fileName: "",
      page: "0",
      pageSize: "10",
      total: 1000,
    };
  },
  methods: {
    goBack() {
      window.history.go(-1)
    },
    handleDelete(index, row) {
      this.$confirm("是否确定删除 Key: " + row.key, "确认删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "放弃",
      })
        .then(() => {
          request.postDelete({
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
        },
        callback: (rsp) => {
          this.keys = rsp.data.keys;
          this.total = rsp.data.total;
        },
      });
    },
  },
  created() {
    this.fileName = this.$route.query.file;

    request.get({
      url: apis.fileKeysDetail,
      data: {
        file: this.fileName,
        page: this.page,
        pageSize: this.pageSize,
      },
      callback: (rsp) => {
        this.keys = rsp.data.keys;
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
