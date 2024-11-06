<script setup lang="ts">
import { computed, ref } from "vue";
import tree from "@/views/components/tree/index.vue";
import { MenuOperation } from "@/enums/commonEnum";
import { useDataDict } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "SystemDataDict"
});

const treeRef = ref();
const tableRef = ref();
const dataListFilter = computed(() => {
  return dataList.value.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );
});

const {
  form,
  loading,
  columns,
  dataList,
  treeData,
  treeLoading,
  pagination,
  deviceDetection,
  onSearch,
  openDialog,
  menuItemsTree,
  onTreeSelect,
  handleDelete,
  handleSizeChange,
  handleCurrentChange
} = useDataDict(tableRef, treeRef);
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <div>
      <tree
        ref="treeRef"
        :class="['mr-2', deviceDetection() ? 'w-full' : 'min-w-[200px]']"
        :treeData="treeData"
        :treeLoading="treeLoading"
        title="字典"
        :show-context-menu="true"
        :show-context-add="true"
        :menu-items="menuItemsTree"
        @tree-select="onTreeSelect"
      />
    </div>
    <div
      :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%-200px)]']"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
        ><el-form-item label=""
      /></el-form>

      <PureTableBar title="" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            :disabled="!form.dataId"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog(MenuOperation.Add)"
          >
            添加元素
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            row-key="id"
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataListFilter"
            :pagination="{ ...pagination, size }"
            :columns="dynamicColumns"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="openDialog(MenuOperation.Update, row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除元素编号为${row.id}的这条数据`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
