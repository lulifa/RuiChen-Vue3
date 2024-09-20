import "./reset.css";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";
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
      minWidth: 150
    },
    {
      label: "姓氏",
      prop: "surname",
      minWidth: 90
    },
    {
      label: "名称",
      prop: "name",
      minWidth: 90
    },
    {
      label: "电子邮箱",
      prop: "email",
      minWidth: 180,
      cellRenderer: ({ row, props }) => (
        <div style="white-space: nowrap;">
          <span>{row.email}</span>
          <el-tag size={props.size} style="margin-left:20px;">
            {row.emailConfirmed ? "已确认" : "未确认"}
          </el-tag>
        </div>
      )
    },
    {
      label: "电话号码",
      prop: "phoneNumber",
      minWidth: 180,
      cellRenderer: ({ row, props }) => (
        <div style="white-space: nowrap;">
          <span>{hideTextAtIndex(row.phoneNumber, { start: 3, end: 6 })}</span>
          <el-tag size={props.size} style="margin-left:20px;">
            {row.phoneNumberConfirmed ? "已确认" : "未确认"}
          </el-tag>
        </div>
      )
    },
    {
      label: "启用",
      prop: "isActive",
      width: 90,
      cellRenderer: scope => (
        <div class="flex justify-center w-full">
          <iconifyIconOffline
            icon={scope.row.isActive ? Check : Close}
            style={{
              color: scope.row.isActive ? "#13ce66" : "#ff4949",
              fontSize: "20px"
            }}
          />
        </div>
      )
    },
    {
      label: "账户锁定",
      prop: "lockoutEnabled",
      width: 100,
      cellRenderer: scope => (
        <div class="flex justify-center w-full">
          <iconifyIconOffline
            icon={scope.row.lockoutEnabled ? Check : Close}
            style={{
              color: scope.row.lockoutEnabled ? "#13ce66" : "#ff4949",
              fontSize: "20px"
            }}
          />
        </div>
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
    await removeOrganizationUnit(row?.id, form.organizationUnitId);
    onSearch();
  }

  function handleSizeChange(val: number) {
    form.maxResultCount = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.skipCount = (val - 1) * pagination.pageSize;
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
