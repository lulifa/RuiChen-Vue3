<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol"; // 导入自定义的 ReCol 组件
import { formRules } from "./utils/rule";
import { FormProps, valueTypeOptions } from "./utils/types";

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
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            :disabled="newFormInline.id ? true : false"
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
        <el-form-item label="值类型">
          <el-select
            v-model="newFormInline.valueType"
            :disabled="newFormInline.id ? true : false"
            placeholder="请选择值类型"
            class="w-full"
            clearable
          >
            <el-option
              v-for="item in valueTypeOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input
            v-model="newFormInline.defaultValue"
            clearable
            placeholder="请输入默认值"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="允许空值">
          <el-switch v-model="newFormInline.allowBeNull" />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="说明">
          <el-input
            v-model="newFormInline.description"
            placeholder="请输入说明"
            type="textarea"
            :rows="10"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
