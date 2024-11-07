<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  frameworkOptions: (): any[] => [],
  dataOptions: (): any[] => []
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
        <el-form-item label="UI框架" prop="framework">
          <el-select
            v-model="newFormInline.framework"
            :disabled="newFormInline.id ? true : false"
            placeholder="请选择UI框架"
            class="w-full"
            clearable
          >
            <el-option
              v-for="item in props.frameworkOptions"
              :key="item.name"
              :label="item.displayName"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="布局约束" prop="dataId">
          <el-select
            v-model="newFormInline.dataId"
            :disabled="newFormInline.id ? true : false"
            placeholder="请选择布局约束"
            class="w-full"
            clearable
          >
            <el-option
              v-for="item in props.dataOptions"
              :key="item.id"
              :label="item.displayName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
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
        <el-form-item label="路径" prop="path">
          <el-input
            v-model="newFormInline.path"
            clearable
            placeholder="请输入路径"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="重定向路径" prop="redirect">
          <el-input
            v-model="newFormInline.redirect"
            clearable
            placeholder="请输入重定向路径"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="说明" prop="description">
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
