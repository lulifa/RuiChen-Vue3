import "./reset.css";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { hideTextAtIndex, deviceDetection } from "@pureadmin/utils";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";

import { removeOrganizationUnit } from "@/api/identity/identity-user";
import {
  getAll as getAllOrganizationUnits,
  getMemberList as getOrganizationUsers,
  addMembers as addOrgUsers
} from "@/api/identity/identity-organizationunit";
import type { GetOrganizationUnitPagedRequest } from "@/api/identity/identity-organizationunit/model";
import type { FormItemProps } from "../utils/types";

export function useUserOrg(tableRef: Ref, treeRef: Ref) {
  interface CustomForm extends Partial<GetOrganizationUnitPagedRequest> {
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
      label: "用户名",
      prop: "userName",
      width: 300
    },
    {
      label: "电子邮箱",
      prop: "email",
      headerAlign: "center",
      align: "left",
      width: 200,
      cellRenderer: ({ row, props }) => {
        if (row.email) {
          return (
            <div style="white-space: nowrap;">
              <el-tag
                size={props.size}
                type={row.emailConfirmed ? "success" : null}
              >
                {row.emailConfirmed ? "已确认" : "未确认"}
              </el-tag>
              <span style="margin-left:10px;">{row.email}</span>
            </div>
          );
        }
      }
    },
    {
      label: "电话号码",
      prop: "phoneNumber",
      headerAlign: "center",
      align: "left",
      width: 200,
      cellRenderer: ({ row, props }) => {
        if (row.phoneNumber) {
          return (
            <div style="white-space: nowrap;">
              <el-tag
                size={props.size}
                type={row.phoneNumberConfirmed ? "success" : null}
              >
                {row.phoneNumberConfirmed ? "已确认" : "未确认"}
              </el-tag>
              <span style="margin-left:10px;">
                {hideTextAtIndex(row.phoneNumber, { start: 3, end: 6 })}
              </span>
            </div>
          );
        }
      }
    },
    {
      label: "启用",
      prop: "isActive",
      cellRenderer: scope => <el-switch v-model={scope.row.isActive} disabled />
    },
    {
      label: "账户锁定",
      prop: "lockoutEnabled",
      cellRenderer: scope => (
        <el-switch v-model={scope.row.lockoutEnabled} disabled />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
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
        const data = await getOrganizationUsers(
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
              await addOrgUsers(curData.id, curData.selectedIds);
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
