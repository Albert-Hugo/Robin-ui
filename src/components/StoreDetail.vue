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
          active-text-color="#E6A23C"
          default-active="1"
          mode="horizontal"
          @select="handleSelect"
          background-color="#000000"
        >
          <el-menu-item index="1">存储细节</el-menu-item>
          <el-menu-item index="2">节点信息</el-menu-item>
        </el-menu>

        <div class="node-agrregate">
          <table>
            <tr>
              <th>Host Info</th>
              <th>Keys</th>
              <th>Size</th>
              <th>File Number</th>
            </tr>
            <tr></tr>
            <tr v-for="item in nodesTotal">
              <td>{{ item.host + ":" + item.port }}</td>
              <td>{{ item.state.keyCount }}</td>
              <td>
                {{ (item.state.dataSize / (1024 * 1024)).toFixed(4) + "mb" }}
              </td>
              <td>{{ item.state.fileCount }}</td>
            </tr>
          </table>
        </div>

        <el-table
          v-if="activeIndex === '1'"
          :data="metaDatas"
          stripe
          border
          @cell-click="cellClick"
        >
          <el-table-column prop="host" label="Host" sortable> </el-table-column>
          <el-table-column prop="port" label="Port"> </el-table-column>
          <el-table-column prop="filename" label="File Name" width="500">
          </el-table-column>
          <el-table-column
            prop="blockListSize"
            label="keys numbers:"
            width="300"
          >
          </el-table-column>
          <el-table-column prop="fileLen" label="File Size"> </el-table-column>
          <el-table-column prop="keyStart" label="Key Range Start">
          </el-table-column>
          <el-table-column prop="keyEnd" label="Key Range End">
          </el-table-column>
        </el-table>

        <div v-if="activeIndex === '2'" class="node-detail">
          <el-card v-for="o in nodes" :key="o.port + o.host" class="box-card">
            <div
              slot="header"
              :class="[o.healthy ? 'node-class-green' : 'node-class-red']"
            >
              <p>IP：{{ o.host }}</p>
              <p>端口：{{ o.port }}</p>
              <p>Status：{{ o.healthy ? "UP" : "DOWN" }}</p>
            </div>
          </el-card>
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            class="add-node-btn"
            @click="addNode"
            >添加节点</el-button
          >
        </div>
      </el-main>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <div class="add-node-container">
          <div class="add-node-input">
            <span>host :</span
            ><el-input
              v-model="addNodeParam.host"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="add-node-input">
            <span>port :</span
            ><el-input
              v-model="addNodeParam.port"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="add-node-input">
            <span>web-port :</span
            ><el-input
              v-model="addNodeParam.httpPort"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <el-button type="primary" @click="addNodeConfirm">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import apis from "../../config/apis";
import request from "../util/request";

export default {
  methods: {
    addNodeConfirm() {
      request.post({
        url: apis.addNode,
        data: this.addNodeParam,
        callback: (rsp) => {
          console.log(rsp);
          this.dialogVisible = false;
          this.$message(rsp.data);
        },
      });
    },
    addNode() {
      console.log("添加节点");
      this.dialogVisible = true;
    },
    search() {
      console.log(this.searchKey);

      request.get({
        url: apis.get,
        data: {
          key: this.searchKey,
        },
        callback: (rsp) => {
          this.searchResult = `${rsp.data}`;
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
      this.$router.push(
        `/keys?file=${row.filename}&keyRangeStart=${row.keyStart}`
      );
    },
  },
  data() {
    return {
      metaDatas: [],
      nodesTotal: [],
      nodes: [],
      activeIndex: "1",
      searchKey: "",
      searchResult: "",
      nodeClass: "nodeClassRed",
      dialogVisible: false,
      addNodeParam: {},
    };
  },
  created() {
    console.log("store detail created");

    request.get({
      url: apis.state,
      callback: (rsp) => {
        rsp.data.forEach((e) => {
          this.metaDatas = this.metaDatas.concat(e.state.metas);
        });
        this.metaDatas.forEach((e) => {
          let mbSize = e.fileLen / (1024 * 1024);
          e.fileLen = mbSize.toFixed(4) + "Mb";
        });

        this.nodesTotal = rsp.data;
      },
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.node-agrregate {
  margin: 20px;
}
.node-agrregate table {
  margin: auto;
}
.add-node-input {
  display: flex;
  margin: 20px;
}
.add-node-input span {
  width: 30%;
  margin: auto;
}
.el-header {
  font-size: 30px;
  font-weight: bold;
  font-style: italic;
}
.node-class-red {
  background-color: #f56c6c;
}
.node-class-green {
  background-color: #67c23a;
}

.search-result {
  margin-bottom: 20px;
  color: rgb(0, 0, 0);
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
p {
  padding-left: 20px;
  padding-right: 20px;
}
.box-card {
  display: flex;
  width: 350px;
  color: #303133;
}

.node-detail {
  position: relative;
}

.add-node-btn {
  position: absolute;
  right: 0;
  bottom: 50%;
}
</style>
