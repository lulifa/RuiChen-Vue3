<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import Segmented from "@/components/ReSegmented";
import { menuTypeOptions } from "../utils/enums";
import { usePublicHooks } from "../../hooks";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({})
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
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
        <el-form-item>
          <Segmented
            v-model="newFormInline.menuType"
            block
            :options="menuTypeOptions"
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType === 0">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="newFormInline.userName"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 0"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="名称">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 0"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="姓氏" prop="surname">
          <el-input
            v-model="newFormInline.surname"
            clearable
            placeholder="请输入姓氏"
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType === 0" v-if="!newFormInline.id">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            show-password
            placeholder="请输入密码"
            :prefix-icon="useRenderIcon(Lock)"
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType === 0">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType === 0">
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-input
            v-model="newFormInline.phoneNumber"
            clearable
            placeholder="请输入电话号码"
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType === 0">
        <el-form-item>
          <el-checkbox v-model="newFormInline.isActive" label="启用" border />
          <el-checkbox
            v-model="newFormInline.lockoutEnabled"
            label="账户锁定"
            border
          />
          <el-checkbox
            v-model="newFormInline.emailConfirmed"
            label="电子邮件已确认"
            border
          />
          <el-checkbox
            v-model="newFormInline.phoneNumberConfirmed"
            label="电话号码已确认"
            border
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType === 1">
        <el-form-item>
          <el-checkbox-group v-model="newFormInline.roleNames">
            <div class="checkbox-container">
              <div
                v-for="option in newFormInline.roleOptions"
                :key="option.name"
                class="checkbox-item"
              >
                <el-checkbox :value="option.name" :label="option.name" border />
              </div>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 2"
        :value="12"
        :xs="24"
        :sm="24"
        >组织机构</re-col
      >
    </el-row>
  </el-form>
</template>

<style scoped>
.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 调整列之间的间隔 */
  width: 100%; /* 使容器宽度自适应 */
}

.checkbox-item {
  flex: 0 1 calc(25% - 10px); /* 四列布局，每列占容器宽度的 25% 减去间距 */
  box-sizing: border-box; /* 确保边框和内边距不会影响宽度计算 */
}
</style>
