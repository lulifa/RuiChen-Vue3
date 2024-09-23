<script setup lang="ts">
import { ref } from "vue";
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
    <el-form-item label="名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :disabled="newFormInline.isStatic"
        placeholder="请输入名称"
      />
    </el-form-item>

    <el-form-item label="类型">
      <el-checkbox v-model="newFormInline.isDefault" label="默认" border />
      <el-checkbox v-model="newFormInline.isPublic" label="公开" border />
    </el-form-item>
  </el-form>
</template>
