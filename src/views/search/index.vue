<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ITour } from '@/api/spot';
  import { ListResult } from '@/types/global';
  import { ArticleBriefInfo } from '@/api/article';
  import { UserState } from '@/store/modules/user/types';
  import {
    getSpotsByKeywords,
    getArticlesByKeywords,
    getUsersByKeywords,
  } from '@/api/search';
  import { redirectHomeWithoutQuery } from '@/router/utils';
  import RandRecomSpot from '../article/components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
  import IPagination from '../components/pagination/index.vue';
  import { DEFAULT_PAGINATION_LIMIT } from '../article/constants';

  const route = useRoute();
  const spots = ref<ListResult<ITour>>();
  const articles = ref<ListResult<ArticleBriefInfo>>();
  const users = ref<ListResult<UserState>>();
  const states = {
    keywords: '',
  };

  const spotPage = ref(1);
  const onSpotPageChange = async (v: number) => {
    spotPage.value = v;
    const { data } = await getSpotsByKeywords(states.keywords, {
      page: v,
      limit: DEFAULT_PAGINATION_LIMIT,
    });
    spots.value = data;
  };
  const articlePage = ref(1);
  const onArticlePageChange = async (v: number) => {
    articlePage.value = v;
    const { data } = await getArticlesByKeywords(states.keywords, {
      page: v,
      limit: DEFAULT_PAGINATION_LIMIT,
    });
    articles.value = data;
  };
  const userPage = ref(1);
  const onUserPageChange = async (v: number) => {
    userPage.value = v;
    const { data } = await getUsersByKeywords(states.keywords, {
      page: v,
      limit: DEFAULT_PAGINATION_LIMIT,
    });
    users.value = data;
  };

  const init = async () => {
    const { query } = route;
    const { s } = query;
    if (!s) {
      redirectHomeWithoutQuery();
      return;
    }
    states.keywords = s as string;

    const [{ data: _spots }, { data: _articles }, { data: _users }] =
      await Promise.all([
        getSpotsByKeywords(s as string),
        getArticlesByKeywords(s as string),
        getUsersByKeywords(s as string),
      ]);

    spots.value = _spots;
    articles.value = _articles;
    users.value = _users;
  };
  init();
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout>
      <template #content>
        <div class="m-2 flex-1 text-left">
          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索景点
              </h2>
            </div>
          </section>

          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索文章
              </h2>
            </div>
          </section>

          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索用户
              </h2>
            </div>
          </section>
        </div>
      </template>
    </SiderLayout>
    <RandRecomSpot></RandRecomSpot>
  </div>
</template>
