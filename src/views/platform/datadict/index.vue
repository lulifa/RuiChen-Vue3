<script setup lang="ts">
import contextmenu from "@/views/components/contextmenu/index1.vue";

defineOptions({
  name: "TreeContextMenu"
});
const treeData = [
  {
    id: 1,
    label: "示例节点1",
    name: "示例节点1",
    children: [
      { label: "子节点1-1", id: 55, name: "子节点1-1" },
      { label: "子节点1-2", id: 43, name: "子节点1-1" }
    ]
  },
  {
    id: 2,
    label: "示例节点2",
    name: "示例节点2",
    children: [
      { label: "子节点2-1", id: 65, name: "子节点1-1" },
      { label: "子节点2-2", id: 63, name: "子节点1-1" }
    ]
  }
];
</script>

<template>
  <contextmenu title="字典" :treeData="treeData" :treeLoading="false" />
</template>

<style lang="scss" scoped></style>
