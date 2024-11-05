<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol"; // 导入自定义的 ReCol 组件
import { formRulesTree } from "./utils/rule";
import { FormPropsTree } from "./utils/types";

const props = withDefaults(defineProps<FormPropsTree>(), {
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
    :rules="formRulesTree"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="显示名称" prop="displayName">
          <el-input
            v-model="newFormInline.displayName"
            clearable
            placeholder="请输入显示名称"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="描述">
          <el-input
            v-model="newFormInline.description"
            placeholder="请输入描述"
            type="textarea"
            :rows="10"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
