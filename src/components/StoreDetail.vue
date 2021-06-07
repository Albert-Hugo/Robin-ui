<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#000"
    >
      <el-menu-item index="1">存储细节</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"
        ><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item
      >
    </el-menu>

    <el-table :data="tableData" stripe border @cell-click="cellClick">
      <el-table-column
        prop="metadata.segmentFileName"
        label="File Name"
        width="500"
      >
      </el-table-column>
      <el-table-column
        prop="metadata.blockListSize"
        label="keys numbers:"
        width="300"
      >
      </el-table-column>
      <el-table-column prop="metadata.fileLen" label="File Size">
      </el-table-column>
      <el-table-column prop="metadata.keyStart" label="Key Range Start">
      </el-table-column>
      <el-table-column prop="metadata.keyEnd" label="Key Range End">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import apis from "../../config/apis";
import request from "../util/request";

export default {
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    cellClick(row, column, cell, event) {
      // console.log(row.filename)
      this.$router.push("/keys?file=" + row.filename);
      // this.$router.push({ name: 'Keys', params: { file: row.filename } })
      // console.log('ss')
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    console.log("store detail created");
    request.get({
      url: apis.state,
      callback: (rsp) => {
        this.tableData = rsp.data.metas;
      },
    });
    // axois.get(apis.state).then((rsp) => {
    //   console.log(rsp.data.metas);
    //   this.tableData = rsp.data.metas;
    // });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
