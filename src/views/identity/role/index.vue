<script setup lang="ts">
import { useRole } from "./utils/hook";
import { ref, computed, nextTick, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  delay,
  subBefore,
  deviceDetection,
  useResizeObserver
} from "@pureadmin/utils";

// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import Menu from "@iconify-icons/ep/menu";
import AddFill from "@iconify-icons/ri/add-circle-line";
import More from "@iconify-icons/ep/more-filled";
import Close from "@iconify-icons/ep/close";
import Check from "@iconify-icons/ep/check";

defineOptions({
  name: "SystemRole"
});

const iconClass = computed(() => {
  return [
    "w-[22px]",
    "h-[22px]",
    "flex",
    "justify-center",
    "items-center",
    "outline-none",
    "rounded-[4px]",
    "cursor-pointer",
    "transition-colors",
    "hover:bg-[#0000000f]",
    "dark:hover:bg-[#ffffff1f]",
    "dark:hover:text-[#ffffffd9]"
  ];
});
const treeRef = ref();
const formRef = ref();
const tableRef = ref();
const contentRef = ref();
const treeHeight = ref();

const {
  form,
  isShow,
  curRow,
  loading,
  columns,
  rowStyle,
  dataList,
  activeTab,
  treeDataAll,
  treeData,
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
  handleSave,
  handleDelete,
  filterMethod,
  transformI18n,
  onQueryChanged,
  // handleDatabase,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useRole(treeRef);

onMounted(() => {
  useResizeObserver(contentRef, async () => {
    await nextTick();
    delay(60).then(() => {
      treeHeight.value = parseFloat(
        subBefore(tableRef.value.getTableDoms().tableWrapper.style.height, "px")
      );
    });
  });
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="高级查询" style="width: 85%" prop="filter">
        <el-input
          v-model="form.filter"
          placeholder="请输入查询内容"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div
      ref="contentRef"
      :class="['flex', deviceDetection() ? 'flex-wrap' : '']"
    >
      <PureTableBar
        :class="[isShow && !deviceDetection() ? '!w-[60vw]' : 'w-full']"
        style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
        title=""
        :columns="columns"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog()"
          >
            新增角色
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :row-style="rowStyle"
            :adaptiveConfig="{ offsetBottom: 108 }"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="{ ...pagination, size }"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="openDialog('修改', row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除角色名称为${row.name}的这条数据`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Menu)"
                        @click="handlePermission(row)"
                      >
                        权限
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>

      <div
        v-if="isShow"
        class="!min-w-[calc(100vw-60vw-268px)] w-full mt-2 px-2 pb-2 bg-bg_color ml-2 overflow-auto"
      >
        <div class="flex">
          <!-- 左侧的 Tab -->
          <div class="tabs-container">
            <el-tabs
              v-model="activeTab"
              tab-position="left"
              @tab-click="tabClick"
            >
              <el-tab-pane
                v-for="item in treeDataAll"
                :key="item.id"
                :name="item.id"
                :label="item.name"
              />
            </el-tabs>
          </div>
          <div class="flex-1 ml-4">
            <div class="flex justify-between w-full px-3 pt-5 pb-4">
              <div class="flex">
                <span :class="iconClass">
                  <IconifyIconOffline
                    v-tippy="{
                      content: '关闭'
                    }"
                    class="dark:text-white"
                    width="18px"
                    height="18px"
                    :icon="Close"
                    @click="handlePermission"
                  />
                </span>
                <span :class="[iconClass, 'ml-2']">
                  <IconifyIconOffline
                    v-tippy="{
                      content: '保存菜单权限'
                    }"
                    class="dark:text-white"
                    width="18px"
                    height="18px"
                    :icon="Check"
                    @click="handleSave"
                  />
                </span>
              </div>
              <p class="font-bold truncate">
                菜单权限
                {{ `${curRow?.name ? `（${curRow.name}）` : ""}` }}
              </p>
            </div>
            <el-input
              v-model="treeSearchValue"
              placeholder="请输入菜单进行搜索"
              class="mb-1"
              clearable
              @input="onQueryChanged"
            />
            <div class="flex flex-wrap">
              <el-checkbox v-model="isExpandAll" label="展开/折叠" />
              <el-checkbox v-model="isSelectAll" label="全选/全不选" />
              <el-checkbox v-model="isLinkage" label="父子联动" />
            </div>
            <div>
              <!-- 右侧的树状结构 -->
              <el-tree-v2
                ref="treeRef"
                show-checkbox
                :data="treeData"
                :props="treeProps"
                :height="treeHeight"
                :check-strictly="!isLinkage"
                :filter-method="filterMethod"
              >
                <template #default="{ node }">
                  <span>{{ transformI18n(node.label) }}</span>
                </template>
              </el-tree-v2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

:deep(.el-table__inner-wrapper::before) {
  height: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.tabs-container {
  margin-top: 125px; /* 设置 Tab 的上边距 */
}

/* 确保覆盖 Element Plus 的样式 */
:deep(.el-tabs__header) {
  width: 100%; /* 确保标签头部宽度为100% */
}

/* 隐藏 tab pane 的内容 */
:deep(.el-tab-pane) {
  display: none; /* 隐藏内容，确保没有内容展示 */
}

/* 为标签项添加样式，使其看起来像卡片 */
:deep(.el-tabs__item) {
  border: 1px solid #a8d8ea; /* 更改边框颜色为更浅的蓝色 */
  border-radius: 4px; /* 圆角 */
  margin-bottom: 10px; /* 标签之间的间距 */
  background-color: #f0f8ff; /* 浅蓝色背景 */
  padding: 10px; /* 内边距 */
  transition: box-shadow 0.3s; /* 过渡效果 */
  text-align: center !important; /* 强制文本居中 */
}

/* 鼠标悬停时的效果 */
:deep(.el-tabs__item:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影 */
}
</style>
