import "./reset.css";
import dayjs from "dayjs";
import editForm from "../form.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { FormProps, FormItemProps } from "../utils/types";
import {
  getKeyList,
  isAllEmpty,
  hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
import { ElForm, ElInput, ElFormItem, ElProgress } from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";

import {
  getAssignableRoles,
  getById,
  getRoleList,
  create,
  deleteById,
  update,
  getListAdvanced,
  getOrganizationUnits,
  setOrganizationUnits
} from "@/api/identity/identity-user";
import type { GetUserPagedRequestAdvanced } from "@/api/identity/identity-user/model";
import { getAll as getAllOrganizationUnits } from "@/api/identity/identity-organizationunit";

export function useUser(tableRef: Ref, treeRef: Ref) {
  interface CustomForm extends Partial<GetUserPagedRequestAdvanced> {
    // 添加自定义字段
  }
  const form = reactive<CustomForm>({});
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "用户头像",
      prop: "avatar",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.avatar || userAvatar}
          preview-src-list={Array.of(row.avatar || userAvatar)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 90
    },
    {
      label: "用户名",
      prop: "userName",
      minWidth: 130
    },
    {
      label: "姓氏",
      prop: "surname",
      minWidth: 130
    },
    {
      label: "名称",
      prop: "name",
      minWidth: 130
    },
    {
      label: "电子邮箱",
      prop: "email",
      minWidth: 90
    },
    {
      label: "手机号码",
      prop: "phoneNumber",
      minWidth: 90,
      formatter: ({ phoneNumber }) =>
        hideTextAtIndex(phoneNumber, { start: 3, end: 6 })
    },
    {
      label: "状态",
      prop: "isActive",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          v-model={scope.row.isActive}
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="已启用"
          inactive-text="已禁用"
          inline-prompt
          disabled
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();

  function handleUpdate(row) {
    console.log(row);
  }

  async function handleDelete(row) {
    await deleteById(row?.id);
    message(`您删除了用户编号为${row.id}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    form.maxResultCount = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.skipCount = (val - 1) * pagination.pageSize;
    onSearch();
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      const data = await getListAdvanced(toRaw(form));
      dataList.value = data.items;
      pagination.total = data.totalCount;
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.organizationUnitId = null;
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.organizationUnitId = selected ? id : "";
    onSearch();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  async function openDialog(title = "新增", row?: FormItemProps) {
    let props = await propsFormInline(title, row);
    addDialog({
      title: `${title}用户`,
      props: props,
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        const orgData = formRef.value.$refs.formtreeRef; // 获取树形组件的 ref
        curData.organizationUnitIds = orgData.getCheckedKeys();
        function chores() {
          message(`您${title}了用户名称为${curData.userName}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              await create(curData);
              await setOrganizationUnits(curData.id, {
                organizationUnitIds: curData.organizationUnitIds
              });
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              await update(curData.id, curData);
              await setOrganizationUnits(curData.id, {
                organizationUnitIds: curData.organizationUnitIds
              });
              chores();
            }
          }
        });
      }
    });
  }

  async function propsFormInline(title, row?: FormItemProps) {
    let props: FormProps = {
      formInline: {
        menuType: 0,
        roleNames: [],
        id: null,
        userName: "",
        name: "",
        surname: "",
        email: "",
        emailConfirmed: false,
        phoneNumber: "",
        phoneNumberConfirmed: false,
        password: "",
        lockoutEnabled: true,
        twoFactorEnabled: true,
        isActive: true,
        roleOptions: [],
        organizationUnitIds: [],
        higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value)
      }
    };
    const roles = await getAssignableRoles();
    if (roles) {
      props.formInline.roleOptions = roles.items;
    }
    if (title !== "新增") {
      const res = await getById(row?.id);
      if (res) {
        props.formInline.id = res.id;
        props.formInline.userName = res.userName;
        props.formInline.name = res.name;
        props.formInline.surname = res.surname;
        props.formInline.email = res.email;
        props.formInline.emailConfirmed = res.emailConfirmed;
        props.formInline.phoneNumber = res.phoneNumber;
        props.formInline.phoneNumberConfirmed = res.phoneNumberConfirmed;
        props.formInline.lockoutEnabled = res.lockoutEnabled;
        props.formInline.twoFactorEnabled = res.twoFactorEnabled;
        props.formInline.isActive = res.isActive;
      }
      const userRoles = await getRoleList(row?.id);
      if (userRoles) {
        props.formInline.roleNames = getKeyList(userRoles.items, "name");
      }
      // 获取机构信息TODO
      const userOrganizationUnits = await getOrganizationUnits(row?.id);
      if (userOrganizationUnits) {
        props.formInline.organizationUnitIds = getKeyList(
          userOrganizationUnits.items,
          "id"
        );
      }
    }
    return props;
  }

  const cropRef = ref();
  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () =>
        h(ReCropperPreview, {
          ref: cropRef,
          imgSrc: row.avatar || userAvatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: done => {
        console.log("裁剪后的图片信息：", avatarInfo.value);
        // 根据实际业务使用avatarInfo.value和row里的某些字段去调用上传头像接口即可
        done(); // 关闭弹框
        onSearch(); // 刷新表格数据
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.userName} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            message(`已成功重置 ${row.userName} 用户的密码`, {
              type: "success"
            });
            console.log(pwdForm.newPwd);
            // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        });
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();
    debugger;
    // 归属部门
    const data = await getAllOrganizationUnits();
    const organizationunits = data.items;
    const options = handleTree(organizationunits, "displayName");
    higherDeptOptions.value = options;
    treeData.value = options;
    treeLoading.value = false;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleReset,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
