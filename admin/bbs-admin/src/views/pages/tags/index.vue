<template>
  <section class="page-container">
    <div class="toolbar">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.id" placeholder="编号" />
        </el-form-item> -->
        <el-form-item>
          <el-input v-model="filters.name" clearable placeholder="名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="list"> 查询 </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd"> 新增 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="results"
      highlight-current-row
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态" width="150">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? "启用" : "禁用" }}
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column prop="updateTime" label="最后修改时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.updateTime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> 编辑 </el-button>
          <el-button size="small" @click="handleDel(scope.$index, scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagebar">
      <el-pagination
        :page-sizes="[20, 50, 100, 300]"
        :current-page="page.page"
        :page-size="page.limit"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleLimitChange"
      />
    </div>

    <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description" type="textarea" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false"> 取消 </el-button>
        <el-button :loading="addLoading" type="primary" @click.native="addSubmit"> 提交 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-input v-model="editForm.id" type="hidden" />
        <el-form-item label="名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" auto-complete="off" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option :value="0" label="启用" />
            <el-option :value="1" label="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false"> 取消 </el-button>
        <el-button :loading="editLoading" type="primary" @click.native="editSubmit">
          提交
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      results: [],
      listLoading: false,
      page: {
        page: 1,
        limit: 20,
      },
      filters: {},
      selectedRows: [],

      addForm: {
        name: "",
        description: "",
        status: "",
        createTime: "",
      },
      addFormVisible: false,
      addLoading: false,

      editForm: {
        id: "",
        name: "",
        description: "",
        status: "",
        createTime: "",
      },
      editFormVisible: false,
      editLoading: false,
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    list() {
      const me = this;
      me.listLoading = true;
      const params = Object.assign(me.filters, {
        page: me.page.page,
        limit: me.page.limit,
      });
      this.axios
        .get(
          "/api/app/tag?Name=" +
            (me.filters.name || "") +
            "&SkipCount=" +
            this.getSkipCount(params.page, params.limit) +
            "&MaxResultCount=" +
            params.limit
        )
        .then((data) => {
          me.results = data.items;
          me.page.total = data.totalCount;
        })
        .finally(() => {
          me.listLoading = false;
        });
    },
    handlePageChange(val) {
      this.page.page = val;
      this.list();
    },
    handleLimitChange(val) {
      this.page.limit = val;
      this.list();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    handleAdd() {
      this.addForm = {
        name: "",
        description: "",
      };
      this.addFormVisible = true;
    },
    addSubmit() {
      const me = this;
      this.axios
        .post("/api/app/tag", this.addForm)
        .then((data) => {
          me.$message({ message: "提交成功", type: "success" });
          me.addFormVisible = false;
          me.list();
        })
        .catch((rsp) => {
          me.$notify.error({ title: "错误", message: rsp.message });
        });
    },
    handleEdit(index, row) {
      const me = this;
      this.axios
        .get("/api/app/tag/" + row.id)
        .then((data) => {
          me.editForm = Object.assign({}, data);
          me.editFormVisible = true;
        })
        .catch((rsp) => {
          me.$notify.error({ title: "错误", message: rsp.message });
        });
    },
    editSubmit() {
      const me = this;
      this.axios
        .put("/api/app/tag/" + me.editForm.id, me.editForm)
        .then((data) => {
          me.list();
          me.editFormVisible = false;
        })
        .catch((rsp) => {
          me.$notify.error({ title: "错误", message: rsp.message });
        });
    },
    handleDel(index, row) {
      const me = this;

      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete("/api/app/tag/" + row.id)
            .then((data) => {
              me.$message({ message: "删除成功", type: "success" });
              me.list();
            })
            .catch((rsp) => {
              me.$notify.error({ title: "错误", message: rsp.message });
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
