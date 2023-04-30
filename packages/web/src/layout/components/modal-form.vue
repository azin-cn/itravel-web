<script lang="ts" setup>
  import { ref } from 'vue';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import { redirectSearch } from '@/router/utils';

  const { visible, setVisible } = useVisible();

  const form = ref({ search: '' as string });

  const onSearch = () => {
    const { search } = form.value;
    if (search.trim()) {
      redirectSearch(search.trim());
      setVisible(false);
    }
  };

  const init = async () => {
    setVisible(true);
  };

  defineExpose({ init });
</script>

<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :footer="false"
      :closable="false"
      :modal-style="{
        borderRadius: '12px',
      }"
      simple
    >
      <a-input-search
        v-model="form.search"
        placeholder="请输入景点、用户或相关分享"
        allow-clear
        style="border-color: rgb(227 227 228 / 100%)"
        @search="onSearch"
        @press-enter="onSearch"
      >
      </a-input-search>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
  :deep(.arco-input-wrapper) {
    background-color: none;
  }
</style>
