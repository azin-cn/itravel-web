<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getUserBriefArticles, ArticleBriefInfo } from '@/api/article';
  import { getSpotBriefInfo, SpotBreifInfoModel } from '@/api/spot';
  import { getUserBriefInfo } from '@/api/user';
  import { formatNumber } from '@/utils/format';
  import * as settings from '@/config/settings.json';
  import { ListResult } from '@/types/global';
  import { UserState } from '@/store/modules/user/types';
  import IPagination from '@/views/components/pagination/index.vue';
  import ArticleBrief from '@/views/components/article/article-brief.vue';
  import RandRecomSpot from '../../components/spot/rand-recom-spot.vue';
  import SiderLayout from '../../components/layout/sider-layout.vue';
  import useArticle from '../../components/article/use-article';

  const route = useRoute();
  const router = useRouter();
  const { onArticleShare, onThumbsUp } = useArticle();

  const userInfo = ref<UserState>();
  const userArticles = ref<ListResult<ArticleBriefInfo>>();
  const page = ref(1);

  const onRedirectUserPreview = (userId: string) => {
    router.push({ name: 'userPreview', params: { userId } });
  };
  const onPageChange = async (v: number) => {
    page.value = v;
    // network
  };

  const init = async () => {
    /**
     * 携带路由参数进入组件
     */
    const { params } = route;
    const { userId } = params;
    if (!userId) {
      router.push({ name: 'home' });
    }
    const [{ data: user }, { data: articles }] = await Promise.all([
      getUserBriefInfo(userId as string),
      getUserBriefArticles(userId as string),
    ]);
    userInfo.value = user;
    userArticles.value = articles;

    document.title = `${settings.title} - 用户 - ${user.username}`;
  };
  init();
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout :limit="10">
      <template #content>
        <div class="m-2 flex-1">
          <!-- 作者介绍和缩略图 -->
          <div class="flex items-stretch">
            <div
              class="flex flex-col justify-center bg-base-100 p-6 mt-2 mb-2 text-gray-700"
              :style="{
                'border': '1px solid #fff',
                'box-shadow': '0 0 2px 0 #ccc',
                'border-radius': '8px',
              }"
            >
              <div class="flex items-center text-left">
                <a-avatar
                  :size="44"
                  :image-url="userInfo?.avatar"
                  class="mr-2 cursor-pointer"
                  @click.stop="onRedirectUserPreview(userInfo?.id as string)"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="text-base">
                      {{ userInfo?.username }}
                    </h4>
                    <span>
                      <IconFont type="icon-tuijian2" />
                      <span class="text-xs link-neutral">
                        {{ userInfo?.visitors || formatNumber(12012) }}
                      </span>
                    </span>
                  </div>
                  <p class="text-xs w-48 truncate">
                    {{
                      userInfo?.description || '人之初，性本善，性相近，习相远'
                    }}
                  </p>
                </div>
              </div>

              <!-- 第一篇文章的点赞 -->
              <div class="flex items-center mt-10">
                <div class="mr-2">
                  <IconFont type="icon-pinglun3" />
                  <span class="text-xs link-neutral">
                    {{
                      userArticles?.list[0].commentCount || formatNumber(120012)
                    }}
                  </span>
                </div>
                <div class="mr-2">
                  <IconFont
                    type="icon-dianzan3"
                    class="cursor-pointer icon-click"
                    @click.stop="onThumbsUp(userArticles?.list[0].id as string)"
                  />
                  <span class="text-xs link-neutral">
                    {{
                      userArticles?.list[0].likeCount || formatNumber(120112)
                    }}
                  </span>
                </div>
                <div class="mr-2">
                  <IconFont
                    type="icon-zhuanfa2"
                    size="13"
                    class="cursor-pointer icon-click"
                    @click.stop="
                      onArticleShare(userArticles?.list[0].id as string)
                    "
                  />
                </div>
              </div>

              <!-- 位置 -->
              <div class="mt-6 text-left">
                <div class="mr-2">
                  <IconFont type="icon-nationaarea" class="mr-1" />
                  <span class="text-sm">
                    {{
                      `${spotInfo?.province.name} - ${spotInfo?.city.name}` ||
                      '暂无数据'
                    }}
                  </span>
                  <div>
                    <IconFont type="icon-zhishipai" class="mr-1" />
                    <span class="text-sm">
                      {{ spotInfo?.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <a-image
              show-loader
              fit="cover"
              class="flex-1 m-2 overflow-hidden h-60 lg:h-80 cursor-pointer"
              style="border-radius: 8px"
              :src="
                userInfo?.thumbUrl ||
                userArticles?.list[0].thumbUrl ||
                userArticles?.list[0].spot.thumbUrl
              "
              :alt="userArticles?.list[0].title"
            >
              <!-- :description="articleInfo?.spot.name" -->
              <template #extra>
                <span class="action" @click="() => {}"><icon-download /></span>
              </template>
            </a-image>
          </div>

          <div class="text-left mt-6 mb-6">
            <h3 class="mb-2 text-lg font-semibold inline-block">
              <IconFont
                type="icon--"
                size="24"
                class="mr-2 align-text-bottom"
              />
              <span>文章</span>
            </h3>
          </div>

          <ArticleBrief
            :img-url="userArticles?.list[0].thumbUrl"
            :list="userArticles?.list as ArticleBriefInfo[]"
          />

          <IPagination
            :on-page-change="onPageChange"
            :page="page"
            :total="userArticles?.total"
          ></IPagination>
        </div>
      </template>
    </SiderLayout>

    <RandRecomSpot></RandRecomSpot>
  </div>
</template>

<style scoped>
  .icon-click {
    transition: all 0.3s;
  }

  .icon-click:active {
    transform: scale(1.2);

    /* 解决active时长太短问题 */
    transition: 0s;
  }
</style>
