<script lang="ts" setup>
  import { ref } from 'vue';
  import { getRandUsers } from '@/api/user';
  import { ArticleBriefInfo, getRandArticles } from '@/api/article';
  import { UserState } from '@/store/modules/user/types';
  import ArticleMini from '../article/article-mini.vue';
  import UserMini from '../user/user-mini.vue';

  export interface IProps {
    limit: number;
  }
  const props = withDefaults(defineProps<IProps>(), { limit: 3 });

  const spotRandArticles = ref<ArticleBriefInfo[]>();
  const spotRandUsers = ref<UserState[]>();

  const onRandArticleRefesh = async () => {
    const { data } = await getRandArticles();
    spotRandArticles.value = data;
  };

  const onRandUserRefresh = async () => {
    const { data } = await getRandUsers();
    spotRandUsers.value = data;
  };

  onRandArticleRefesh();
  onRandUserRefresh();
</script>

<template>
  <a-layout class="mr-10 ml-10">
    <a-layout>
      <a-layout-content class="pb-1">
        <slot name="content"> <a-empty class="w-full"></a-empty> </slot>
      </a-layout-content>
      <a-layout-sider
        :resize-directions="['left']"
        style="min-width: 26%; max-width: 50%"
        class="itravel-spot-layout__sider"
      >
        <ArticleMini
          :list="spotRandArticles as ArticleBriefInfo[]"
          :refresh="onRandArticleRefesh"
          :limit="limit"
        />

        <UserMini
          :list="spotRandUsers as UserState[]"
          :refresh="onRandUserRefresh"
          :limit="limit"
        />
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<style scoped>
  .itravel-spot-layout__sider :deep(.arco-layout-sider-children) {
    justify-content: flex-start;
  }
</style>
