import "./reset.css";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";

import { deviceDetection } from "@pureadmin/utils";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";

import { removeOrganizationUnit } from "@/api/identity/identity-role";
import {
  getAll as getAllOrganizationUnits,
  getRoleList as getOrganizationRoles,
  addRoles as addOrgRoles
} from "@/api/identity/identity-organizationunit";
import type { FormItemProps } from "../utils/types";
import type { GetRolePagedRequest } from "@/api/identity/identity-role/model";

export function useRoleOrg(tableRef: Ref, treeRef: Ref) {
  interface CustomForm extends Partial<GetRolePagedRequest> {
    // 添加自定义字段
    organizationUnitId: string;
  }
  const form = reactive<CustomForm>({
    // 左侧部门树的id
    organizationUnitId: ""
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
      label: "角色名称",
      prop: "name",
      minWidth: 150
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  async function handleDelete(row) {
    await removeOrganizationUnit(row?.id, form.organizationUnitId);
    onSearch();
  }

  function handleSizeChange(val: number) {
    form.maxResultCount = val;
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.skipCount = (val - 1) * pagination.pageSize;
    pagination.currentPage = val;
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      if (form.organizationUnitId) {
        const data = await getOrganizationRoles(
          form.organizationUnitId,
          toRaw(form)
        );
        dataList.value = data.items;
        pagination.total = data.totalCount;
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
    form.organizationUnitId = null;
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.organizationUnitId = selected ? id : "";
    onSearch();
  }

  function openDialog(title = "选择") {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          id: form.organizationUnitId,
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

    // 归属部门
    const data = await getAllOrganizationUnits();
    const organizationunits = data.items;
    const options = handleTree(organizationunits, "displayName");
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
