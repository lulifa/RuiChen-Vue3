<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  ref,
  computed,
  watch,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount
} from "vue";

import Dept from "@iconify-icons/ri/git-branch-line";
// import Reset from "@iconify-icons/ri/restart-line";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import LocationCompany from "@iconify-icons/ep/add-location";
import ExpandIcon from "./svg/expand.svg?component";
import UnExpandIcon from "./svg/unexpand.svg?component";

import type { ContextMenuItemModel } from "./types";
import "v-contextmenu/dist/themes/default.css";

import {
  Contextmenu,
  ContextmenuItem,
  ContextmenuDivider
} from "v-contextmenu";

interface Tree {
  id: number;
  name: string;
  highlight?: boolean;
  children?: Tree[];
}

const props = defineProps<{
  treeLoading: Boolean;
  treeData: any[];
  title: string;
  showContextMenu: Boolean;
  menuItems: ContextMenuItemModel[];
}>();

const emit = defineEmits(["tree-select"]);

const treeRef = ref();
const isExpand = ref(true);
const searchValue = ref("");
const highlightMap = ref({});
const { proxy } = getCurrentInstance();
const defaultProps = {
  children: "children",
  label: "name"
};
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

/** 重置部门树状态（选中状态、搜索框值、树初始化） */
function onTreeReset() {
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

defineExpose({ onTreeReset });

const contextmenu = ref(null);

// 默认的菜单项
const defaultMenuItems = ref<ContextMenuItemModel[]>([
  {
    label: `编辑${props.title}`,
    icon: "ep:edit-pen",
    handler: () => {
      console.log("编辑菜单项");
    }
  },
  {
    label: `添加子级${props.title}`,
    icon: "ep:plus",
    handler: () => {
      console.log("添加子级菜单项");
    }
  },
  {
    label: `删除${props.title}`,
    icon: "ep:delete",
    handler: () => {
      console.log("删除菜单项");
    }
  }
]);

const menuItemsComputed = computed(() => {
  return props.menuItems.length > 0 ? props.menuItems : defaultMenuItems.value;
});

// 处理右键点击事件
const handleNodeContextMenu = (event, data, node, component) => {
  console.log("右键点击的时间event：", event);
  console.log("被右键点击的节点数据:", data);
  console.log("节点对象:", node);
  console.log("节点组件:", component);
  show({ top: event.clientY, left: event.clientX });
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

// 添加全局点击事件监听器
const handleClickOutside = event => {
  const contextmenuElement = contextmenu.value?.$el; // 获取上下文菜单的 DOM 元素
  if (contextmenuElement && !contextmenuElement.contains(event.target)) {
    hide(); // 如果点击的不是上下文菜单，则隐藏菜单
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div
    v-loading="treeLoading"
    class="h-full bg-bg_color overflow-hidden relative"
    :style="{ minHeight: `calc(100vh - 175px)` }"
  >
    <div class="flex items-center h-[34px]">
      <el-input
        v-model="searchValue"
        class="ml-2"
        size="small"
        placeholder="请输入部门名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
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
                @click="toggleRowExpansionAll(isExpand ? false : true)"
              >
                {{ isExpand ? "折叠全部" : "展开全部" }}
              </el-button>
            </el-dropdown-item>
            <!-- <el-dropdown-item>
              <el-button
                :class="buttonClass"
                link
                type="primary"
                :icon="useRenderIcon(Reset)"
                @click="onTreeReset"
              >
                重置状态
              </el-button>
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider />
    <el-scrollbar height="calc(90vh - 125px)">
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
            :Contextmenu="showContextMenu ? 'contextmenu' : null"
            :class="[
              'rounded',
              'flex',
              'items-center',
              'select-none',
              'hover:text-primary',
              searchValue.trim().length > 0 &&
                node.label.includes(searchValue) &&
                'text-red-500',
              highlightMap[node.id]?.highlight ? 'dark:text-primary' : ''
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
            <IconifyIconOffline
              :icon="
                data.type === 1
                  ? OfficeBuilding
                  : data.type === 2
                    ? LocationCompany
                    : Dept
              "
            />
            <span class="!w-[120px] !truncate" :title="node.label">
              {{ node.label }}
            </span>
          </div>
        </template>
      </el-tree>
      <Contextmenu ref="contextmenu">
        <template v-for="(item, index) in menuItemsComputed" :key="index">
          <ContextmenuItem
            v-if="!item.hidden && !item.divider"
            :disabled="item.disabled"
            @click="item.handler"
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
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: transparent;
}

:deep(.el-tree-node.is-current > .el-tree-node__content .wrapper) {
  background-color: #a5d3f0 !important;
}

:deep(.wrapper) {
  padding-left: 10px;
  display: flex;
  align-items: center;
  width: 100%;
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
