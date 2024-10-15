import editForm from "../form.vue";
import editformpermission from "@/views/identity/components/permtree/role/index.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import {
  type Ref,
  reactive,
  ref,
  onMounted,
  h,
  toRaw,
  watch,
  computed,
  nextTick
} from "vue";
import type { FormProps, FormItemProps } from "../utils/types";
import {
  create,
  update,
  deleteById,
  getById,
  getList
} from "@/api/identity/identity-role";
import type { GetRolePagedRequest } from "@/api/identity/identity-role/model";
import {
  get as getAbpPermissions,
  update as updateAbpPermissions
} from "@/api/permission/permission-definition-abp";
import type {
  PermissionGroup,
  PermissionProvider,
  PermissionTree
} from "@/api/permission/permission-definition-abp/model";

export function useRole(treeRef: Ref) {
  interface CustomForm extends Partial<GetRolePagedRequest> {
    // 添加自定义字段
  }
  const form = reactive<CustomForm>({});
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const treePermIds = ref([]);
  const treeDataPermAll = ref<PermissionTree[]>([]);
  const activeTab = ref(null);
  const treeDataPerm = ref<PermissionTree[]>([]);
  const isShow = ref(false);
  const loading = ref(true);
  const isLinkage = ref(false);
  const treeSearchValue = ref();
  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const treeProps = {
    value: "id",
    label: "name",
    children: "children"
  };
  const permissionQuery: PermissionProvider = {
    providerKey: "",
    providerName: "R"
  };
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
      width: 210,
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
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.skipCount = (val - 1) * pagination.pageSize;
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

  /** 权限 */
  async function handlePermission(row?: any) {
    const { id } = row;
    if (id) {
      curRow.value = row;
      isShow.value = true;

      permissionQuery.providerKey = row?.name;
      const data = await getAbpPermissions(permissionQuery);
      const nodes = generatePermissionTreeRoot(data.groups);

      treeDataPermAll.value = nodes.filter(item => item.isRoot);
      activeTab.value = treeDataPermAll.value[0]?.id || null;
      const treenodes = treeDataPermAll.value.flatMap(root => root.children);

      treeDataPerm.value = handleTree(treenodes);
      treePermIds.value = getKeyList(treenodes, "id");
      const checkedKeys = getKeyList(
        treenodes.filter(v => v.isGranted),
        "id"
      );

      await nextTick();
      setTimeout(() => {
        tabCore(activeTab.value);
        treeRef.value.setCheckedKeys(checkedKeys);
      }, 0);
    } else {
      curRow.value = null;
      isShow.value = false;
    }
  }

  /** 测试权限 */
  async function handlePermissionTest(row?: any) {
    addDialog({
      title: `角色权限-${row?.name}`,
      props: {
        formInline: {
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
  }

  function generatePermissionTreeRoot(permissionGroups: PermissionGroup[]) {
    const trees: PermissionTree[] = [];
    permissionGroups.forEach(g => {
      const root: PermissionTree = {
        isRoot: true,
        group: null,
        id: g.name,
        parentId: g.name,
        name: g.displayName,
        label: g.displayName,
        disabled: true,
        children: [],
        isGranted: false,
        grantedProviders: [],
        allowedProviders: []
      };
      let rootChildren: PermissionTree[] = [];
      g.permissions.forEach(p => {
        const tree: PermissionTree = {
          isRoot: false,
          group: g.name,
          id: p.name,
          parentId: p.parentName,
          name: p.displayName,
          label: p.displayName,
          disabled: false,
          children: [],
          isGranted: p.isGranted,
          grantedProviders: p.grantedProviders,
          allowedProviders: p.allowedProviders
        };
        rootChildren.push(tree);
      });
      root.children = rootChildren;

      trees.push(root);
    });
    return trees;
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  async function handleSave() {
    const arr = [];
    for (let node of treeDataPerm.value) {
      traverseTree(node, arr);
    }
    await updateAbpPermissions(permissionQuery, { permissions: arr });
    curRow.value = null;
    isShow.value = false;
  }

  function traverseTree(node, arr) {
    const newcheckedKeys = treeRef.value.getCheckedKeys();
    const isChecked = newcheckedKeys.includes(node.id);

    // 处理当前节点
    if (node.isGranted !== isChecked) {
      arr.push({
        isGranted: !node.isGranted,
        name: node.id
      });
    }
    // 处理子节点
    if (node.children) {
      node.children.forEach(child => traverseTree(child, arr));
    }
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.group)!.includes(query);
  };

  const tabClick = tab => {
    tabCore(tab.paneName);
  };

  function tabCore(name: string) {
    activeTab.value = name;
    treeRef.value!.filter(name);
  }

  onMounted(async () => {
    onSearch();
  });

  watch(isExpandAll, val => {
    val
      ? treeRef.value.setExpandedKeys(treePermIds.value)
      : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
    val
      ? treeRef.value.setCheckedKeys(treePermIds.value)
      : treeRef.value.setCheckedKeys([]);
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    activeTab,
    treeDataPermAll,
    treeDataPerm,
    tabClick,
    treeProps,
    isLinkage,
    pagination,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handlePermission,
    handlePermissionTest,
    handleSave,
    handleDelete,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
