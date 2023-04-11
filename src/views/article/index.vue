<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getArticleById, ArticleBriefInfo } from '@/api/article';
  import RandRecomSpot from './components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';

  const route = useRoute();
  const router = useRouter();

  const articleInfo = ref<ArticleBriefInfo>();

  const init = async () => {
    /**
     * 携带路由参数进入组件
     */
    const { params } = route;
    const { articleId } = params;
    if (!articleId) {
      router.push({ name: 'home' });
      return;
    }

    const { data } = await getArticleById(articleId as string);
    articleInfo.value = data;
  };

  init();
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout>
      <template #content> 这是内容 </template>
    </SiderLayout>

    <RandRecomSpot></RandRecomSpot>
  </div>
</template>
