<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { FormProps } from "./utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { getUnaddedRoleList } from "@/api/identity/identity-organizationunit/index";
import { getKeyList } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { GetRolePagedRequest } from "@/api/identity/identity-role/model";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({})
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

const loading = ref(true);
const tableRef = ref();
const dataList = ref([]);
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});
const columns: TableColumnList = [
  {
    label: "勾选列", // 如果需要表格多选，此处label必须设置
    type: "selection",
    fixed: "left",
    reserveSelection: true // 数据刷新后保留选项
  },
  {
    label: "用户名",
    prop: "name"
  }
];
interface CustomForm extends Partial<GetRolePagedRequest> {
  id: string;
}

const formRole = reactive<CustomForm>({
  id: newFormInline.value.id
});

async function onSearch() {
  loading.value = true;
  try {
    const data = await getUnaddedRoleList(formRole);
    dataList.value = data.items;
    pagination.total = data.totalCount;
  } finally {
    loading.value = false;
  }
}

function handleSizeChange(val: number) {
  formRole.maxResultCount = val;
  onSearch();
}

function handleCurrentChange(val: number) {
  formRole.skipCount = (val - 1) * pagination.pageSize;
  onSearch();
}

/** 当CheckBox选择项发生变化时会触发该事件 */
function handleSelectionChange(val) {
  // 重置表格高度
  tableRef.value.setAdaptive();
  const curSelected = tableRef.value.getTableRef().getSelectionRows();
  newFormInline.value.selectedIds = getKeyList(curSelected, "id");
}

onMounted(async () => {
  onSearch();
});
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="formRole"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item style="width: 70%">
        <el-input
          v-model="formRole.filter"
          placeholder="请输入搜索内容"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
      </el-form-item>
    </el-form>

    <pure-table
      ref="tableRef"
      row-key="id"
      adaptive
      maxHeight="350"
      align-whole="center"
      table-layout="auto"
      :adaptiveConfig="{ offsetBottom: 108 }"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      @selection-change="handleSelectionChange"
      @page-size-change="handleSizeChange"
      @page-current-change="handleCurrentChange"
    />
  </div>
</template>
