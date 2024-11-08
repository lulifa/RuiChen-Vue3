import "./reset.css";
import editForm from "../form.vue";
import editFormTree from "../formTree.vue";
import { handleTree } from "@/utils/tree";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { MenuOperation } from "@/enums/commonEnum";
import { deviceDetection } from "@pureadmin/utils";
import { type Ref, h, ref, reactive, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import {
  getAll as getAllDatas,
  get as getData,
  update as updateData,
  create as createData,
  remove as removeData,
  createItem,
  updateItem,
  removeItem
} from "@/api/platform/platform-datas";
import {
  type FormItemProps,
  type FormProps,
  type FormItemPropsTree,
  type FormPropsTree,
  valueTypeMaps
} from "../utils/types";
import {
  ValueType,
  type GetDataByPaged
} from "@/api/platform/platform-datas/model";
import type { ContextMenuItemModel } from "@/views/components/tree/utils/types";

export function useDataDict(tableRef: Ref, treeRef: Ref) {
  interface CustomForm extends Partial<GetDataByPaged> {
    // 添加自定义字段
    dataId: string;
  }
  const form = reactive<CustomForm>({
    // 左侧树的id
    dataId: ""
  });
  const formRef = ref();
  const formRefTree = ref();
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
    await removeItem(form.dataId, row?.name);
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
      if (form.dataId) {
        const data = await getData(form.dataId);
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

  function openDialog(operation, row?: FormItemProps) {
    debugger;
    let props = propsFormInline(operation, row);
    addDialog({
      title: `${operation}元素`,
      props: props,
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
            if (operation == MenuOperation.Add) {
              await createItem(form.dataId, curData);
            } else {
              await updateItem(form.dataId, curData.name, curData);
            }
            onSearch();
            chores();
          }
        });
      }
    });
  }

  function propsFormInline(operation: MenuOperation, row: FormItemProps) {
    let props: FormProps = {
      formInline: {
        id: "",
        dataId: form.dataId,
        name: "",
        displayName: "",
        description: "",
        defaultValue: "",
        allowBeNull: true,
        valueType: ValueType.String
      }
    };
    if (operation == MenuOperation.Update) {
      props.formInline.id = row?.id;
      props.formInline.name = row?.name;
      props.formInline.displayName = row?.displayName;
      props.formInline.description = row?.description;
      props.formInline.defaultValue = row?.defaultValue;
      props.formInline.allowBeNull = row?.allowBeNull;
      props.formInline.valueType = row?.valueType;
    }
    return props;
  }

  const menuItemsTree = ref<ContextMenuItemModel[]>([
    {
      label: `新增字典`,
      icon: "ep:plus",
      isAdd: true,
      handler: node => {
        console.log(node);
        console.log("新增菜单项");
        openDialogTree(MenuOperation.Add, node);
      }
    },
    {
      label: `编辑字典`,
      icon: "ep:edit-pen",
      handler: node => {
        console.log(node);
        console.log("编辑菜单项");
        openDialogTree(MenuOperation.Update, node);
      }
    },
    {
      label: `添加子级字典`,
      icon: "ep:plus",
      handler: node => {
        console.log(node);
        console.log("添加子级菜单项");
        openDialogTree(MenuOperation.AddChild, node);
      }
    },
    {
      label: `删除字典`,
      icon: "ep:delete",
      handler: node => {
        console.log(node.value);
        console.log("删除菜单项");
        ElMessageBox.confirm(
          `确认删除${node.value?.name}该项字典 且无法恢复?`
        ).then(async () => {
          await removeData(node.value?.id);
          await loadTree();
        });
      }
    }
  ]);

  async function openDialogTree(operation, node?) {
    debugger;
    let props = await propsFormInlineTree(operation, node);
    addDialog({
      title: `${operation}字典`,
      props: props,
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editFormTree, { ref: formRefTree }),
      beforeSure: (done, { options }) => {
        const FormRef = formRefTree.value.getRef();
        const curData = options.props.formInline as FormItemPropsTree;
        function chores() {
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (
              operation === MenuOperation.Add ||
              operation === MenuOperation.AddChild
            ) {
              await createData(curData);
            } else if (operation === MenuOperation.Update) {
              await updateData(curData.id, curData);
            }

            await loadTree();
            chores();
          }
        });
      }
    });
  }

  async function propsFormInlineTree(operation: MenuOperation, node) {
    let props: FormPropsTree = {
      formInline: {
        id: "",
        parentId: "",
        name: "",
        displayName: "",
        description: ""
      }
    };
    if (operation == MenuOperation.AddChild) {
      props.formInline.parentId = node.value?.id;
    }
    if (operation == MenuOperation.Update) {
      const res = await getData(node.value?.id);
      if (res) {
        props.formInline.id = res.id;
        props.formInline.parentId = res.parentId;
        props.formInline.name = res.name;
        props.formInline.displayName = res.displayName;
        props.formInline.description = res.description;
      }
    }
    return props;
  }

  async function loadTree() {
    treeLoading.value = true;
    try {
      const data = await getAllDatas();
      const datas = data.items;
      const options = handleTree(datas, "displayName");
      higherDeptOptions.value = options;
      treeData.value = options;
    } finally {
      treeLoading.value = false;
    }
  }

  onMounted(async () => {
    await loadTree();
    onSearch();
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
    menuItemsTree,
    onTreeSelect,
    handleDelete,
    handleSizeChange,
    handleCurrentChange
  };
}
