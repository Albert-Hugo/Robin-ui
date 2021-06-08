<template>
  <div>
    <el-container>
      <el-header>Robin DB</el-header>

      <el-main>
        <div style="margin-bottom: 15px">
          <el-input
            placeholder="请输入内容"
            v-model="searchKey"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </div>
        <div class="search-result">搜索结果：{{ searchResult }}</div>
        <el-menu
          default-active="1"
          mode="horizontal"
          @select="handleSelect"
          background-color="#000"
        >
          <el-menu-item index="1">存储细节</el-menu-item>
          <el-menu-item index="2">节点信息</el-menu-item>
        </el-menu>

        <el-table
          v-if="activeIndex === '1'"
          :data="tableData"
          stripe
          border
          @cell-click="cellClick"
        >
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

        <div v-if="activeIndex === '2'">
          <el-card v-for="o in nodes" :key="o.port + o.host" class="box-card">
            <div slot="header" class="clearfix">
              <span>节点：{{ o.host }}</span>
              <span>节点：{{ o.port }}</span>
              <span>节点：{{ o.healthy }}</span>
              <el-button style="float: right; padding: 3px 0" type="text"
                >操作按钮</el-button
              >
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import apis from "../../config/apis";
import request from "../util/request";

export default {
  methods: {
    search() {
      console.log(this.searchKey);

      request.get({
        url: apis.get,
        data: {
          key: this.searchKey,
        },
        callback: (rsp) => {

          this.searchResult = `key:${this.searchKey} value:${rsp.data}`;
        },
      });
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      
      if (key == "2") {
        request.get({
          url: apis.nodesInfo,
          callback: (rsp) => {
            this.nodes = rsp.data;
          },
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    cellClick(row, column, cell, event) {
      this.$router.push("/keys?file=" + row.filename);
    },
  },
  data() {
    return {
      tableData: [],
      nodes: [],
      activeIndex: "1",
      searchKey: "",
      searchResult: "",
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
.search-result {
  margin-bottom: 20px;
  color: coral;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.box-card {
}
</style>
