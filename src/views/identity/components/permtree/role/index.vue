<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { FormProps } from "./utils/types";
import { transformI18n } from "@/plugins/i18n";
import {
  PermissionGroup,
  PermissionProvider,
  PermissionTree
} from "@/api/permission/permission-definition-abp/model";
import {
  get as getAbpPermissions,
  update as updateAbpPermissions
} from "@/api/permission/permission-definition-abp";
import { getKeyList, handleTree } from "@pureadmin/utils";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({})
});
const newFormInline = ref(props.formInline);

const treeProps = {
  value: "id",
  label: "label",
  children: "children"
};
const permissionQuery: PermissionProvider = {
  providerKey: "",
  providerName: "R"
};
const ruleFormRef = ref();
const treeRef = ref();
const treePermIds = ref([]);
const treeDataPermAll = ref<PermissionTree[]>([]);
const activeTab = ref(null);
const treeDataPerm = ref<PermissionTree[]>([]);
const checkedKeys = ref([]);
const isLinkage = ref(false);
const treeSearchValue = ref();
const isExpandAll = ref(false);
const isSelectAll = ref(false);

const tabClick = tab => {
  tabCore(tab.paneName);
};
function tabCore(name: string) {
  activeTab.value = name;
  treeRef.value!.filter(name);
}
const onQueryChanged = (query: string) => {
  treeRef.value!.filter(query);
};

const filterMethod = (query: string, node) => {
  return (
    transformI18n(node.group)!.includes(query) ||
    transformI18n(node.label)!.includes(query)
  );
};
function genePermissionTreeRoot(permissionGroups: PermissionGroup[]) {
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
const loadTree = async () => {
  permissionQuery.providerKey = newFormInline.value.curRow?.name;
  const data = await getAbpPermissions(permissionQuery);
  const nodes = genePermissionTreeRoot(data.groups);

  treeDataPermAll.value = nodes.filter(item => item.isRoot);
  activeTab.value = treeDataPermAll.value[0]?.id || null;
  const treenodes = treeDataPermAll.value.flatMap(root => root.children);
  const treenodesChecked = treenodes.filter(v => v.isGranted);

  treeDataPerm.value = handleTree(treenodes);

  treePermIds.value = getKeyList(treenodes, "id");
  checkedKeys.value = getKeyList(treenodesChecked, "id");
};
const loadTreeOperation = async () => {
  await nextTick();
  tabCore(activeTab.value);
  treeRef.value.setCheckedKeys(checkedKeys.value);
};
function getRef() {
  return ruleFormRef.value;
}
async function handleSave() {
  const arr = [];
  for (let node of treeDataPerm.value) {
    traverseTree(node, arr);
  }
  await updateAbpPermissions(permissionQuery, { permissions: arr });
}

onMounted(async () => {
  await loadTree();
  await loadTreeOperation();
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

defineExpose({ getRef, handleSave });
</script>

<template>
  <el-card ref="ruleFormRef" shadow="never" :model="newFormInline" class="mb-2">
    <div class="flex flex-wrap">
      <el-input
        v-model="treeSearchValue"
        placeholder="请输入权限进行搜索"
        class="mb-1"
        clearable
        @input="onQueryChanged"
      />

      <div class="flex items-center ml-auto space-x-4 mb-1 mr-2">
        <el-checkbox v-model="isExpandAll" label="展开/折叠" />
        <el-checkbox v-model="isSelectAll" label="全选/全不选" />
        <el-checkbox v-model="isLinkage" label="父子联动" />
      </div>
    </div>

    <div class="flex">
      <!-- 左侧的 Tab -->
      <div class="tab-container">
        <el-tabs v-model="activeTab" tab-position="left" @tab-click="tabClick">
          <el-tab-pane
            v-for="item in treeDataPermAll"
            :key="item.id"
            :name="item.id"
            :label="item.name"
          />
        </el-tabs>
      </div>
      <div class="flex-1 ml-4">
        <el-tree-v2
          ref="treeRef"
          class="tree-container"
          show-checkbox
          :data="treeDataPerm"
          :props="treeProps"
          :height="500"
          :check-strictly="!isLinkage"
          :filter-method="filterMethod"
        >
          <template #default="{ node }">
            <span>{{ transformI18n(node.label) }}</span>
          </template>
        </el-tree-v2>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.tab-container {
  height: 500px;
  overflow: auto;
}
.tree-container {
  padding-top: 10px;
  border: 1px solid #e0e0e0; /* 树的边框 */
  border-radius: 4px;
}
:deep(.el-tabs__item) {
  border: 1px solid #a8d8ea; /* 更改边框颜色为更浅的蓝色 */
  border-radius: 4px; /* 圆角 */
  margin-bottom: 10px; /* 标签之间的间距 */
  background-color: #f0f8ff; /* 浅蓝色背景 */
  padding: 10px; /* 内边距 */
  transition: box-shadow 0.3s; /* 过渡效果 */
  justify-content: center !important;
}

:deep(.el-tabs__item.is-active) {
  background-color: #a8d8ea; /* 选中状态的背景色 */
  color: #7b7dc9; /* 选中状态的文字颜色 */
  border: 1px solid #a8d8ea; /* 边框颜色可以根据需要调整 */
}
</style>
