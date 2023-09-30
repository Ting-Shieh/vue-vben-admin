<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getMenuList } from '/@/api/demo/system';
  import { createMenu, updateMenu } from '/@/api/sys/menu';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const exitId = ref(null)
      const treeData = ref([])
      const { createMessage } = useMessage()
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          exitId.value = data.record.id
          setFieldsValue({
            ...data.record,
          });
        }
        treeData.value = await getMenuList();
        updateSchema({
          field: 'parentMenu',
          componentProps: { treeData: treeData.value },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      function checkAllChildrenMenuDisabled(updateMenu){
        const id = updateMenu.id
        let isAllClosed: boolean = true;
        // 查找二級菜單
        const subMenus = treeData.value.filter(it => it.pid === id)
        subMenus.forEach((menu) => {
          if ( menu.active ===1) {
            isAllClosed = false;
            return;
          }
        })
        if (!isAllClosed) {
          return false
        }
        // 查找三級菜單
        subMenus.forEach((menu) => {
          isAllClosed = checkAllChildrenMenuDisabled(menu)
          if (!isAllClosed) {
            return;
          }
        })
        return isAllClosed;
      }
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
          console.log('isUpdate', isUpdate.value);
          if (values.parentMenu) {
            values.pid = values.parentMenu
          } else {
            values.pid = 0
          }
          delete values.parentMenu
          if(isUpdate.value) {
            values.id = exitId.value
            // 判斷所有子菜單全部關閉後，主菜單才能關閉
            const ret = checkAllChildrenMenuDisabled(values)
            if(ret) {
              try {
                await updateMenu({ data: values });
                createMessage.success('更新菜單成功！')
              } catch (e) {
                console.error(e)
              }
            } else {
              createMessage.error('請先禁用所有子菜單！！！！')
            }
          } else {
            try {
              await createMenu({ data: values });
              createMessage.success('創建菜單成功！')
            } catch(e) {
              console.error('創建菜單失敗！')
            }
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
