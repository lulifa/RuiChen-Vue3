<script setup lang="ts">
import Dept from "@iconify-icons/ri/git-branch-line";
import Reset from "@iconify-icons/ri/restart-line";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import LocationCompany from "@iconify-icons/ep/add-location";
import ExpandIcon from "./svg/expand.svg?component";
import UnExpandIcon from "./svg/unexpand.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import type { ContextMenuItemModel } from "./types";
import "v-contextmenu/dist/themes/default.css";
import {
  Contextmenu,
  ContextmenuItem,
  ContextmenuDivider
} from "v-contextmenu";

import {
  ref,
  computed,
  watch,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount
} from "vue";

interface Tree {
  id: number;
  name: string;
  highlight?: boolean;
  children?: Tree[];
}

const buttonClass = computed(() => {
  return [
    "!h-[20px]",
    "!text-sm",
    "reset-margin",
    "!text-[var(--el-text-color-regular)]",
    "dark:!text-white",
    "dark:hover:!text-primary"
  ];
});

const props = withDefaults(
  defineProps<{
    treeLoading: boolean;
    treeData: any[];
    title?: string;
    showContextMenu?: boolean;
    showContextAdd?: boolean;
    menuItems?: ContextMenuItemModel[];
  }>(),
  {
    treeLoading: false,
    treeData: () => [],
    title: "",
    showContextMenu: false,
    showContextAdd: false,
    menuItems: () => []
  }
);

const { proxy } = getCurrentInstance();
const treeRef = ref();
const isExpand = ref(true);
const searchValue = ref("");
const highlightMap = ref({});
const selectedNode = ref(null);
const defaultProps = {
  children: "children",
  label: "name"
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

function nodeClick(value) {
  const nodeId = value.$treeNodeId;
  highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
    ? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: false
      })
    : Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: true
      });
  Object.values(highlightMap.value).forEach((v: Tree) => {
    if (v.id !== nodeId) {
      v.highlight = false;
    }
  });
  emit(
    "tree-select",
    highlightMap.value[nodeId]?.highlight
      ? Object.assign({ ...value, selected: true })
      : Object.assign({ ...value, selected: false })
  );
}

function toggleRowExpansionAll(status) {
  isExpand.value = status;
  const nodes = (proxy.$refs["treeRef"] as any).store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

/** 重置树状态（选中状态、搜索框值、树初始化） */
function onTreeReset() {
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

const emit = defineEmits(["tree-select"]);

defineExpose({ onTreeReset });

const contextmenu = ref(null);

// 默认的菜单项
const defaultMenuItems = ref<ContextMenuItemModel[]>([
  {
    label: `新增${props.title}`,
    icon: "ep:plus",
    isAdd: true,
    handler: node => {
      console.log(node);
      console.log("新增菜单项");
    }
  },
  {
    label: `编辑${props.title}`,
    icon: "ep:edit-pen",
    handler: node => {
      console.log(node);
      console.log("编辑菜单项");
    }
  },
  {
    label: `添加子级${props.title}`,
    icon: "ep:plus",
    handler: node => {
      console.log(node);
      console.log("添加子级菜单项");
    }
  },
  {
    label: `删除${props.title}`,
    icon: "ep:delete",
    handler: node => {
      console.log(node);
      console.log("删除菜单项");
    }
  }
]);

const getMenus = () => {
  return props.menuItems.length > 0 ? props.menuItems : defaultMenuItems.value;
};

const menuItemsShow = computed(() => {
  return getMenus().filter(item => !item.isAdd);
});

const menuItemsAdd = computed(() => {
  const menusFilter = getMenus().filter(item => item.isAdd);
  return menusFilter[0] || null;
});

// 处理右键点击事件
const handleNodeContextMenu = (event, data, node, component) => {
  console.log("右键点击的时间event：", event);
  console.log("被右键点击的节点数据:", data);
  console.log("节点对象:", node);
  console.log("节点组件:", component);
  selectedNode.value = data;
  if (props.showContextMenu) {
    show({ top: event.clientY, left: event.clientX });
  } else {
    hide();
  }
};

// 显示上下文菜单
const show = position => {
  if (contextmenu.value) {
    contextmenu.value.show(position);
  }
};

// 隐藏上下文菜单
const hide = () => {
  if (contextmenu.value) {
    contextmenu.value.hide();
  }
};
const handleMenuItemClick = (item: ContextMenuItemModel) => {
  item.handler(selectedNode);
  hide();
};

const handleClickOutside = event => {
  const menu = contextmenu.value?.$el;
  const isMenuClicked = menu && menu.contains(event.target);
  const isMenuItemClicked = event.target.closest(".v-contextmenu-item");
  if (!isMenuClicked && !isMenuItemClicked) {
    hide();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

const getNodeIcon = type => {
  switch (type) {
    case 1:
      return OfficeBuilding;
    case 2:
      return LocationCompany;
    default:
      return Dept;
  }
};
</script>

<template>
  <div
    v-loading="treeLoading"
    class="h-full bg-bg_color overflow-hidden relative"
    :style="{ minHeight: `calc(100vh - 142px)` }"
  >
    <div class="flex items-center h-[34px]">
      <el-input
        v-model="searchValue"
        class="ml-2"
        size="small"
        placeholder="请输入名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="!searchValue.length"
              icon="ri:search-line"
            />
          </el-icon>
        </template>
      </el-input>
      <el-dropdown :hide-on-click="false">
        <IconifyIconOffline
          class="w-[28px] cursor-pointer"
          width="18px"
          :icon="More2Fill"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button
                :class="buttonClass"
                link
                type="primary"
                :icon="useRenderIcon(isExpand ? ExpandIcon : UnExpandIcon)"
                @click="toggleRowExpansionAll(!isExpand)"
              >
                {{ isExpand ? "折叠全部" : "展开全部" }}
              </el-button>
            </el-dropdown-item>

            <el-dropdown-item>
              <el-button
                :class="buttonClass"
                link
                type="primary"
                :icon="useRenderIcon(Reset)"
                @click="onTreeReset"
              >
                重置状态
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider />
    <el-scrollbar height="calc(90vh - 105px)">
      <el-tree
        ref="treeRef"
        :data="treeData"
        node-key="id"
        size="small"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
        @node-contextmenu="handleNodeContextMenu"
      >
        <template #default="{ node, data }">
          <div
            Contextmenu:contextmenu
            :class="[
              'rounded',
              'flex',
              'items-center',
              'select-none',
              'hover:text-primary',
              {
                'text-red-500':
                  searchValue.trim() && node.label.includes(searchValue)
              },
              { 'dark:text-primary': highlightMap[node.id]?.highlight }
            ]"
            :style="{
              color: highlightMap[node.id]?.highlight
                ? 'var(--el-color-primary)'
                : '',
              background: highlightMap[node.id]?.highlight
                ? 'var(--el-color-primary-light-7)'
                : 'transparent'
            }"
          >
            <IconifyIconOffline :icon="getNodeIcon(data.type)" />
            <span class="!w-[140px] !truncate" :title="node.label">
              {{ node.label }}
            </span>
          </div>
        </template>
      </el-tree>
      <Contextmenu ref="contextmenu">
        <template v-for="(item, index) in menuItemsShow" :key="index">
          <ContextmenuItem
            v-if="!item.hidden && !item.divider"
            :disabled="item.disabled"
            :hideOnClick="false"
            @click="handleMenuItemClick(item)"
          >
            <template #default>
              <span class="menu-item-content">
                <span v-if="item.icon" class="menu-item-icon">
                  <component :is="useRenderIcon(item.icon)" />
                </span>
                <span>{{ item.label }}</span>
              </span>
            </template>
          </ContextmenuItem>
          <ContextmenuDivider v-if="item.divider" />
        </template>
      </Contextmenu>
    </el-scrollbar>
    <div
      v-if="showContextAdd"
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2"
    >
      <el-button
        type="primary"
        :icon="useRenderIcon(menuItemsAdd?.icon)"
        @click="menuItemsAdd?.handler"
      >
        {{ menuItemsAdd?.label }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: transparent;
}

/* 增加菜单项之间的上下间距 */
:deep(.v-contextmenu-item) {
  padding: 10px 15px; /* 上下各增加10px的间距 */
  margin-bottom: 5px; /* 菜单项之间的额外间距 */
}

:deep(.menu-item-content) {
  display: inline-flex;
  align-items: center;
  font-size: 1em; /* 放大字体 */
}

:deep(.menu-item-icon) {
  display: inline-block;
  margin-right: 16px; /* 增大图标和文字之间的间距 */
  font-size: 1em; /* 放大图标 */
}

:deep(.menu-item-label) {
  font-weight: 400; /* 使文本稍微加粗，更清晰 */
}
</style>
