<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({})
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="部门名称" prop="displayName">
          <el-input
            v-model="newFormInline.displayName"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <re-col>
      <el-form-item label="上级部门">
        <el-cascader
          v-model="newFormInline.parentId"
          class="w-full"
          :options="newFormInline.higherDeptOptions"
          :props="{
            value: 'id',
            label: 'name',
            emitPath: false,
            checkStrictly: true
          }"
          clearable
          filterable
          placeholder="请选择上级部门"
        >
          <template #default="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
    </re-col>
  </el-form>
</template>
