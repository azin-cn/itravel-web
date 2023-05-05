<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { promiseTimeout } from '@vueuse/core';
  import ArticleCard from '@/views/components/article-card/index.vue';
  import { ArticleBriefInfo, getRecomMobileArticles } from '@/api/article';
  import { DEFAULT_PAGINATION_LIMIT } from '@/api/constant';
  import { redirectArticle } from '@/router/utils';

  const { loading, setLoading } = useLoading();
  const counter = ref(1);
  const articles = ref<ArticleBriefInfo[]>();

  const onPageChange = async (page = 0) => {
    const { data } = await getRecomMobileArticles({
      page: page || counter.value,
      limit: DEFAULT_PAGINATION_LIMIT,
    });
    counter.value += 1;

    if (page === 1) {
      articles.value = data;
    } else {
      articles.value = articles.value ? [...articles.value, ...data] : data;
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    await onPageChange(1);
    setLoading(false);
  };

  const onRedirectArticle = (id: string) => {
    redirectArticle(id);
  };

  const init = async () => {
    onPageChange(1);
  };
  init();
</script>

<template>
  <van-pull-refresh v-model="loading" class="flex-1" @refresh="onRefresh">
    <div v-if="articles?.length">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @click.stop="onRedirectArticle(article.id)"
      />
    </div>
  </van-pull-refresh>
</template>
