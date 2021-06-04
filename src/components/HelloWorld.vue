<template>

      <el-table :data="tableData" stripe >
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
      </el-table>
</template>

<script>
import axois from "axios";
import apis from "../../config/apis";

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
  },
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    console.log("created");
    axois.get(apis.state).then((rsp) => {
      console.log(rsp.data.metas);
      this.tableData = rsp.data.metas;
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
