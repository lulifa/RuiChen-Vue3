import "./reset.css";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";

import { deviceDetection } from "@pureadmin/utils";
import { type Ref, h, ref, reactive, onMounted } from "vue";

import { removeOrganizationUnit } from "@/api/identity/identity-role";
import { addRoles as addOrgRoles } from "@/api/identity/identity-organizationunit";
import {
  getAll as getAllDatas,
  get as getDataItems
} from "@/api/platform/datas";
import { type FormItemProps, valueTypeMaps } from "../utils/types";
import type { GetRolePagedRequest } from "@/api/identity/identity-role/model";

export function useRoleOrg(tableRef: Ref, treeRef: Ref) {
  interface CustomForm extends Partial<GetRolePagedRequest> {
    // 添加自定义字段
    dataId: string;
  }
  const form = reactive<CustomForm>({
    // 左侧树的id
    dataId: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "名称",
      prop: "name",
      width: 180
    },
    {
      label: "显示名称",
      prop: "displayName",
      width: 180
    },
    {
      label: "说明",
      prop: "description",
      showOverflowTooltip: true
    },
    {
      label: "值类型",
      prop: "valueType",
      width: 150,
      formatter: ({ valueType }) => {
        return valueTypeMaps[valueType];
      }
    },
    {
      label: "默认值",
      prop: "defaultValue",
      width: 150
    },
    {
      label: "允许空值",
      prop: "allowBeNull",
      width: 90,
      cellRenderer: scope => (
        <el-switch v-model={scope.row.allowBeNull} disabled />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  async function handleDelete(row) {
    await removeOrganizationUnit(row?.id, form.dataId);
    onSearch();
  }

  function handleSizeChange(val: number) {
    form.maxResultCount = val;
    pagination.pageSize = val;
  }

  function handleCurrentChange(val: number) {
    form.skipCount = (val - 1) * pagination.pageSize;
    pagination.currentPage = val;
  }

  async function onSearch() {
    loading.value = true;
    try {
      if (form.dataId) {
        const data = await getDataItems(form.dataId);
        dataList.value = data.items;
        pagination.total = data.items.length;
      } else {
        dataList.value = [];
        pagination.total = 0;
      }
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.dataId = null;
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.dataId = selected ? id : "";
    onSearch();
  }

  function openDialog(title = "选择", row?) {
    console.log(row);
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          id: form.dataId,
          selectedIds: []
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (curData.selectedIds.length > 0) {
              await addOrgRoles(curData.id, curData.selectedIds);
            }
            chores();
          }
        });
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    const data = await getAllDatas();
    const datas = data.items;
    const options = handleTree(datas, "displayName");
    higherDeptOptions.value = options;
    treeData.value = options;
    treeLoading.value = false;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    pagination,
    deviceDetection,
    onSearch,
    resetForm,
    openDialog,
    onTreeSelect,
    handleDelete,
    handleSizeChange,
    handleCurrentChange
  };
}
