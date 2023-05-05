<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { promiseTimeout } from '@vueuse/core';
  import ArticleCard from '@/views/components/article-card/index.vue';

  const { loading, setLoading } = useLoading();

  const count = ref(0);

  const onRefresh = async () => {
    setLoading(true);
    count.value += 1;
    await promiseTimeout(2000);
    setLoading(false);
  };
</script>

<template>
  <van-pull-refresh v-model="loading" class="flex-1" @refresh="onRefresh">
    <div>
      <ArticleCard v-for="item in 2" :key="item"></ArticleCard>
      <p style="height: 200px">刷新次数: {{ count }}</p>
    </div>
  </van-pull-refresh>
</template>
