<template>
  <div>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      @node-contextmenu="handleNodeContextMenu"
    >
      <template #default="{ data }">
        <div Contextmenu:contextmenu class="wrapper">
          {{ data.label }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ContextMenuItem } from "./types";
import "v-contextmenu/dist/themes/default.css";

import {
  Contextmenu,
  ContextmenuItem,
  ContextmenuDivider
} from "v-contextmenu";

// Props
const props = defineProps<{
  title: string;
  menuItems: ContextMenuItem[];
}>();

const contextmenu = ref(null);

// 默认的菜单项
const defaultMenuItems = ref<ContextMenuItem[]>([
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

// 定义树形结构数据
const treeData = ref([
  {
    id: 1,
    label: "示例节点1",
    children: [{ label: "子节点1-1" }, { label: "子节点1-2" }]
  },
  {
    id: 2,
    label: "示例节点2",
    children: [{ label: "子节点2-1" }, { label: "子节点2-2" }]
  }
]);

// 定义树形结构的属性
const defaultProps = {
  children: "children",
  label: "label"
};

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

<style scoped>
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
