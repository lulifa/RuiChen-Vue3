import editForm from "../form.vue";
import editformpermission from "@/views/identity/components/permtree/index.vue";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import { addDrawer } from "@/components/ReDrawer";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { reactive, ref, onMounted, h, toRaw, computed } from "vue";
import type { FormProps, FormItemProps } from "../utils/types";
import {
  create,
  update,
  deleteById,
  getById,
  getList
} from "@/api/identity/identity-role";
import type { GetRolePagedRequest } from "@/api/identity/identity-role/model";

export function useRole() {
  interface CustomForm extends Partial<GetRolePagedRequest> {
    // 添加自定义字段
  }
  const form = reactive<CustomForm>({});
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
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
      headerAlign: "center",
      align: "left",
      cellRenderer: ({ row, props }) => {
        const tags = [
          { condition: row.isDefault, label: "默认", type: null },
          { condition: row.isPublic, label: "公开", type: null },
          { condition: row.isStatic, label: "内置", type: "danger" }
        ];
        return (
          <div style="white-space: nowrap;">
            {tags.map((tag, index) =>
              tag.condition ? (
                <el-tag
                  key={index}
                  size={props.size}
                  type={tag.type}
                  style="margin-right: 20px;"
                >
                  {tag.label}
                </el-tag>
              ) : null
            )}
            <span>{row.name}</span>
          </div>
        );
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  async function handleDelete(row) {
    await deleteById(row?.id);
    message(`您删除了角色名称为${row.name}的这条数据`, { type: "success" });
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

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const data = await getList(toRaw(form));
      dataList.value = data.items;
      pagination.total = data.totalCount;
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  async function openDialog(title = "新增", row?: FormItemProps) {
    let props = await propsFormInline(title, row);
    addDialog({
      title: `${title}角色`,
      props: props,
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              await create(curData);
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              await update(curData.id, curData);
              chores();
            }
          }
        });
      }
    });
  }

  async function propsFormInline(title, row?: FormItemProps) {
    let props: FormProps = {
      formInline: {
        id: null,
        name: "",
        isDefault: false,
        isPublic: false,
        isStatic: false
      }
    };
    if (title !== "新增") {
      const role = await getById(row?.id);
      if (role) {
        props.formInline.id = role.id;
        props.formInline.name = role.name;
        props.formInline.isDefault = role.isDefault;
        props.formInline.isPublic = role.isPublic;
        props.formInline.isStatic = role.isStatic;
      }
    }
    return props;
  }

  /** 权限 抽屉和弹出框两种模式 */
  async function handlePermission(row?: any, type = "dialog") {
    if (type == "drawer") {
      addDrawer({
        title: `权限-${row?.name}`,
        size: "40%",
        props: {
          formInline: {
            providerName: "R",
            curRow: row
          }
        },
        closeOnClickModal: false,
        contentRenderer: () => h(editformpermission, { ref: formRef }),
        beforeSure: (done, { options }) => {
          const curData = options.props.formInline as FormItemProps;
          console.log(curData);
          formRef.value.handleSave();
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
      });
    } else {
      addDialog({
        title: `权限-${row?.name}`,
        width: "40%",
        props: {
          formInline: {
            providerName: "R",
            curRow: row
          }
        },
        closeOnClickModal: false,
        fullscreen: deviceDetection(),
        contentRenderer: () => h(editformpermission, { ref: formRef }),
        beforeSure: (done, { options }) => {
          const curData = options.props.formInline as FormItemProps;
          console.log(curData);
          formRef.value.handleSave();
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
      });
    }
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handlePermission,
    handleDelete,
    transformI18n,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
