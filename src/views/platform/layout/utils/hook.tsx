import editForm from "../form.vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { reactive, ref, onMounted, h, toRaw, computed } from "vue";
import type { FormProps, FormItemProps } from "../utils/types";
import type { GetLayoutPagedRequest } from "@/api/platform/layouts/model";
import {
  create,
  update,
  deleteById,
  get,
  getList
} from "@/api/platform/layouts";
import { getByName, getAll } from "@/api/platform/datas/index";

export function useLayout() {
  interface CustomForm extends Partial<GetLayoutPagedRequest> {
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
      label: "路径",
      prop: "path"
    },
    {
      label: "UI框架",
      prop: "framework"
    },
    {
      label: "重定向路径",
      prop: "redirect"
    },
    {
      label: "说明",
      prop: "description"
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
      title: `${title}布局`,
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
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          debugger;
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
        framework: "",
        dataId: "",
        name: "",
        path: "",
        displayName: "",
        description: "",
        redirect: "",
        meta: {}
      },
      frameworkOptions: [],
      dataOptions: []
    };
    const frameworks = await getByName("UI Framework");
    props.frameworkOptions = frameworks.items;

    const datas = await getAll();
    props.dataOptions = datas.items;

    if (title !== "新增") {
      const layout = await get(row?.id);
      if (layout) {
        props.formInline.id = layout.id;
        props.formInline.framework = layout.framework;
        props.formInline.dataId = layout.dataId;
        props.formInline.name = layout.name;
        props.formInline.displayName = layout.displayName;
        props.formInline.path = layout.path;
        props.formInline.description = layout.description;
        props.formInline.redirect = layout.redirect;
        props.formInline.meta = layout.meta;
      }
    }
    return props;
  }

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
    handleDelete,
    transformI18n,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
