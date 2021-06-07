<template>
  <div>
    <el-container>
      <el-header>Robin DB</el-header>
      <el-main>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#000"
        >
          <el-menu-item index="1">存储细节</el-menu-item>
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
          <el-table-column prop="metadata.mbSize" label="File Size">
          </el-table-column>
          <el-table-column prop="metadata.keyStart" label="Key Range Start">
          </el-table-column>
          <el-table-column prop="metadata.keyEnd" label="Key Range End">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import apis from "../../config/apis";
import request from "../util/request";

export default {
  methods: {
    handleSelect() {},
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
      activeIndex: "1",
    };
  },
  created() {
    console.log("store detail created");
    request.get({
      url: apis.state,
      callback: (rsp) => {
        this.tableData = rsp.data.metas;
        this.tableData.forEach((e) => {
          let mbSize = e.metadata.fileLen / (1024 * 1024);
          e.metadata.mbSize = mbSize.toFixed(2) + "Mb";
        });
      },
    });
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
