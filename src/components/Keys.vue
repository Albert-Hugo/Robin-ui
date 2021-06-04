<template>
  <div>
    this is keys

    <el-table :data="tableData" stripe border @cell-click="cellClick">
      <el-table-column
        prop="key"
        label="Key Name"
        width="300"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axois from "axios";
import apis from "../../config/apis";

export default {
  methods: {},
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    // console.log(this.$route.query.file);
    axois
      .get(apis.fileKeysDetail + "?file=" + this.$route.query.file)
      .then((rsp) => {
        console.log(rsp.data);
        this.tableData = rsp.data
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
