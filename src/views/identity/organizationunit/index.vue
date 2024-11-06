<script setup lang="ts">
import basicOrg from "@/views/identity/organizationunit/pages/basic/index.vue";
import roleOrg from "@/views/identity/organizationunit/pages/role/index.vue";
import userOrg from "@/views/identity/organizationunit/pages/user/index.vue";

defineOptions({
  name: "SysOrgAll"
});
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";

const activeName = ref("basic");
const tabKey = ref(0); // 用于强制重新渲染

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
  // 切换 Tab 时更新 tabKey，强制刷新组件
  tabKey.value++;
};
</script>

<template>
  <div style="margin-top: 4px; margin-bottom: 2px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :key="tabKey" label="基本信息" name="basic"
        ><basicOrg
      /></el-tab-pane>
      <el-tab-pane :key="tabKey" label="关联角色" name="role"
        ><roleOrg
      /></el-tab-pane>
      <el-tab-pane :key="tabKey" label="关联用户" name="user"
        ><userOrg
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped></style>
