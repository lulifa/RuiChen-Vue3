<template>
  <div>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
      @node-contextmenu="handleNodeContextMenu"
    >
      <template #default="{ data }">
        <div v-contextmenu:contextmenu class="wrapper">
          {{ data.label }}
        </div>
      </template>
    </el-tree>

    <v-contextmenu ref="contextmenu">
      <template v-for="(item, index) in menuItemsComputed" :key="index">
        <!-- 动态菜单项 -->
        <v-contextmenu-item
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
        </v-contextmenu-item>

        <!-- 动态分隔符 -->
        <v-contextmenu-divider v-if="item.divider" />
      </template>
    </v-contextmenu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ContextMenuItem } from "./types";
import "v-contextmenu/dist/themes/default.css";

import {
  directive,
  Contextmenu,
  ContextmenuItem,
  ContextmenuDivider,
  ContextmenuSubmenu,
  ContextmenuGroup
} from "v-contextmenu";

export default defineComponent({
  name: "ExampleSimple",

  components: {
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
    [ContextmenuDivider.name]: ContextmenuDivider,
    [ContextmenuSubmenu.name]: ContextmenuSubmenu,
    [ContextmenuGroup.name]: ContextmenuGroup
  },

  directives: {
    contextmenu: directive
  },
  props: {
    title: {
      type: String,
      required: true // 设置为必传属性
    },
    menuItems: {
      type: Array as PropType<ContextMenuItem[]>,
      default: () => [] // 默认为空数组
    }
  },
  setup(props) {
    // 默认的菜单项
    const defaultMenuItems: ContextMenuItem[] = [
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
    ];

    // 使用传递的 menuItems 或者默认的 menuItems
    const menuItemsComputed = ref<ContextMenuItem[]>(
      props.menuItems.length > 0 ? props.menuItems : defaultMenuItems
    );

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

    // 处理节点点击事件
    const handleNodeClick = node => {
      debugger;
      console.log("点击了节点:", node.label);
      hide();
    };

    // 引用上下文菜单
    const contextmenu = ref(null);

    // 处理右键点击事件
    const handleNodeContextMenu = (event, data, node, component) => {
      debugger;
      console.log("右键点击的时间event：", event);
      console.log("被右键点击的节点数据:", data);
      console.log("节点对象:", node);
      console.log("节点组件:", component);
    };

    // 显示上下文菜单
    const show = (position: { top: number; left: number }) => {
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

    return {
      useRenderIcon,
      treeData,
      defaultProps,
      contextmenu, // 返回 contextmenu 引用
      handleNodeContextMenu,
      handleNodeClick,
      menuItemsComputed
    };
  }
});
</script>

<style scoped>
:deep(.el-tree-node.is-current > .el-tree-node__content .wrapper) {
  background-color: #a5d3f0 !important;
}

.wrapper {
  padding-left: 10px;
  display: flex;
  align-items: center;
  width: 100%;
}

/* 增加菜单项之间的上下间距 */
.v-contextmenu-item {
  padding: 10px 15px; /* 上下各增加10px的间距 */
  margin-bottom: 5px; /* 菜单项之间的额外间距 */
}

.menu-item-content {
  display: inline-flex;
  align-items: center;
  font-size: 1em; /* 放大字体 */
}

.menu-item-icon {
  display: inline-block;
  margin-right: 16px; /* 增大图标和文字之间的间距 */
  font-size: 1em; /* 放大图标 */
}

.menu-item-label {
  font-weight: 400; /* 使文本稍微加粗，更清晰 */
}
</style>
