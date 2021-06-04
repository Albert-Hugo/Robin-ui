<template>

      <el-table :data="tableData" stripe border @cell-click="cellClick" >
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
    cellClick(row, column, cell, event){
      // console.log(row.filename)
      this.$router.push('/keys?file='+row.filename)
      // this.$router.push({ name: 'Keys', params: { file: row.filename } })
        // console.log('ss')
    }
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
