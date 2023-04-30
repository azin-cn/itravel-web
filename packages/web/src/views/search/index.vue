<script lang="ts" setup>
  import { ref, computed } from 'vue';
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
  import { replaceHomeWithoutQuery, redirectSpot } from '@/router/utils';
  import { setDocumentTitle } from '@/utils/window';
  import RandRecomSpot from '../article/components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
  import IPagination from '../components/pagination/index.vue';
  import { DEFAULT_PAGINATION_LIMIT } from '../article/constants';
  import ArticleBrief from '../components/article/article-brief.vue';
  import UserBrief from '../components/user/user-brief.vue';

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
  const siderLimit = computed(() => {
    const { list } = articles.value || {};
    /**
     * 不存在返回 3
     */
    if (!list) return 3;

    /**
     * 如果article list的长度小于四，则分别限制randArticles和randUsers的长度为6
     */
    if (list.length < 4) return 6;

    /**
     * 最长十条
     */
    return 10;
  });

  const init = async () => {
    const { query } = route;
    const { s } = query;
    if (!s) {
      replaceHomeWithoutQuery();
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

    setDocumentTitle(`搜索 | ${s}`);
  };
  init();
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout :limit="siderLimit">
      <template #content>
        <div class="m-2 flex-1 text-left">
          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索用户
              </h2>
            </div>
            <UserBrief v-if="users?.total" :list="users?.list as UserState[]" />
            <a-empty v-else />
            <IPagination
              :page="userPage"
              :on-page-change="onUserPageChange"
              :total="users?.total"
            />
          </section>

          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索文章
              </h2>
            </div>

            <ArticleBrief
              v-if="articles?.list"
              :list="articles?.list as ArticleBriefInfo[]"
            />
            <a-empty v-else />
            <IPagination
              :page="articlePage"
              :on-page-change="onArticlePageChange"
              :total="articles?.total"
            />
          </section>

          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索景点
              </h2>
            </div>
            <div v-if="spots?.total" class="flex flex-wrap max-w-full">
              <div
                v-for="item in spots.list"
                :key="item.id"
                class="card w-1/3 p-4 hover-card"
                style="height: 260px"
              >
                <img
                  :src="item.thumbUrl"
                  class="shadow-xl h-3/5 rounded-lg hover-img cursor-pointer"
                  style="object-fit: cover"
                  :alt="item.name"
                  @click.stop="redirectSpot(item.id as string)"
                />
                <div class="card-body">
                  <a-tooltip :content="item.name">
                    <h2 class="text-xl font-semibold truncate">
                      {{ item.name }}
                    </h2>
                  </a-tooltip>
                  <p>
                    <a class="link link-hover link-primary">
                      [ {{ item.region }} ]
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <a-empty v-else />
            <IPagination
              :page="spotPage"
              :on-page-change="onSpotPageChange"
              :total="spots?.total"
            />
          </section>
        </div>
      </template>
    </SiderLayout>
    <RandRecomSpot></RandRecomSpot>
  </div>
</template>

<style scoped>
  /* less 结合 tailwind 会出现问题 */
  .card-title {
    min-width: 0;
    max-width: 200px;
  }

  .truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .hover-card,
  .hover-img {
    transition: all 0.3s;
  }

  .hover-card:hover {
    /* @apply w-1/2; */
  }

  .hover-img:hover {
    transform: scale(1.14);
  }
</style>
