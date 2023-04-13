<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ArticleBriefInfo, getArticleById } from '@/api/article';
  import { setDocumentTitle } from '@/utils/window';
  import SiderLayout from '../components/layout/sider-layout.vue';

  const genDefaultForm = (): Partial<ArticleBriefInfo> => ({});

  const route = useRoute();
  const router = useRouter();

  const articleForm = ref<Partial<ArticleBriefInfo>>();

  const init = async () => {
    const { params } = route;
    const { articleId } = params;

    if (articleId) {
      const { data } = await getArticleById(articleId as string);
      articleForm.value = data;

      setDocumentTitle(`编辑文章 - ${data.title}`);
    } else {
      setDocumentTitle(`创建文章`);
    }
  };
  init();
</script>

<template>
  <div>
    <SiderLayout></SiderLayout>
  </div>
</template>
