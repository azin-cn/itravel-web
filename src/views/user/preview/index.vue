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
          <div class="items-stretch">
            <div
              class="flex flex-1 justify-center bg-base-100 p-6 mt-2 mb-2 text-gray-700"
              :style="{
                'border': '1px solid #fff',
                'box-shadow': '0 0 2px 0 #ccc',
                'border-radius': '8px',
              }"
            >
              <div class="w-1/2 flex items-center self-center">
                <div class="flex items-center text-left">
                  <a-avatar
                    :size="64"
                    :image-url="userInfo?.avatar"
                    class="mr-12 cursor-pointer"
                    @click.stop="onRedirectUserPreview(userInfo?.id as string)"
                  />

                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h4 class="text-2xl truncate" style="max-width: 60%">
                        {{ userInfo?.username }}
                      </h4>
                      <span>
                        <IconFont type="icon-tuijian2" />
                        <span class="text-xs link-neutral">
                          {{
                            userInfo?.visitors ||
                            formatNumber(Math.random() * 10000)
                          }}
                        </span>
                      </span>
                    </div>
                    <p class="text-xs w-full truncate">
                      {{
                        userInfo?.description ||
                        '人之初，性本善，性相近，习相远'
                      }}
                    </p>
                    <!-- 位置 -->
                    <div class="mt-3 text-left">
                      <div class="mr-2">
                        <IconFont type="icon-nationaarea" class="mr-1" />
                        <span class="text-sm">
                          最近去过：{{
                            `${userArticles?.list[0]?.spot.name || '暂无数据'}`
                          }}
                        </span>
                        <div>
                          <IconFont type="icon-zhishipai" class="mr-1" />
                          <span class="text-sm">
                            最新分享：{{
                              `${userArticles?.list[0]?.title || '暂无数据'}`
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            :img-url="userArticles?.list[0]?.spot.thumbUrl"
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
