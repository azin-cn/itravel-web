<script lang="ts" setup>
  import { ref, watch } from 'vue';

  export interface IPagination {
    total: number;
    page?: number;
    onPageChange: (page: number) => Promise<void>;
  }

  const emits = defineEmits(['update:page']);
  const current = ref(1);
  const props = withDefaults(defineProps<IPagination>(), {
    total: 0,
    page: 1,
  });

  watch(
    () => props.page,
    (v) => {
      current.value = v;
    }
  );

  const onChange = async (v: number) => {
    await props.onPageChange(v);
    emits('update:page', v);
  };
</script>

<template>
  <div class="flex justify-center">
    <a-pagination
      :total="total"
      :current="current"
      class="itravel-pagination"
      @change="onChange"
    />
  </div>
</template>

<style lang="less" scoped>
  :deep(.itravel-pagination) {
    .arco-pagination-item-active,
    .arco-pagination-item-active:hover {
      color: hsl(var(--pf, var(--p)) / var(--tw-text-opacity));
      background-color: unset;
    }
  }
</style>
