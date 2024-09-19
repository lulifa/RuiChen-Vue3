import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormProps, FormItemProps } from "../utils/types";
import { cloneDeep, deviceDetection } from "@pureadmin/utils";

import {
  getAll,
  get,
  create,
  update,
  deleteById
} from "@/api/identity/identity-organizationunit";
import type { GetOrganizationUnitPagedRequest } from "@/api/identity/identity-organizationunit/model";

export function useDept() {
  interface CustomForm extends GetOrganizationUnitPagedRequest {
    // 添加自定义字段
    filter: string;
  }
  const form = reactive<CustomForm>({
    filter: null
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "部门名称",
      prop: "displayName",
      width: 180,
      align: "left"
    },
    {
      label: "编号",
      prop: "code",
      minWidth: 180
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      const data = await getAll(toRaw(form)); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
      let newData = data.items;
      dataList.value = handleTree(newData, "displayName"); // 处理成树结构
    } finally {
      loading.value = false;
    }
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  async function openDialog(title = "新增", row?: FormItemProps) {
    let props = await propsFormInline(title, row);
    addDialog({
      title: `${title}部门`,
      props: props,
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        debugger;
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了部门名称为${curData.displayName}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            debugger;
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
        parentId: row?.parentId,
        displayName: "",
        code: "",
        higherDeptOptions: formatHigherDeptOptions(cloneDeep(dataList.value))
      }
    };
    if (title !== "新增") {
      const res = await get(row?.id);
      if (res) {
        props.formInline.id = res.id;
        props.formInline.parentId = res.parentId;
        props.formInline.displayName = res.displayName;
        props.formInline.code = res.code;
      }
    }
    return props;
  }

  async function handleDelete(row) {
    await deleteById(row?.id);
    message(`您删除了部门名称为${row.name}的这条数据`, { type: "success" });
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改部门 */
    openDialog,
    /** 删除部门 */
    handleDelete,
    handleSelectionChange
  };
}
