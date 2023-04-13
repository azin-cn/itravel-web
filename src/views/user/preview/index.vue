<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getArticleById, ArticleBriefInfo } from '@/api/article';
  import { getSpotBriefInfo, SpotBreifInfoModel } from '@/api/spot';
  import { formatNumber } from '@/utils/format';
  import RandRecomSpot from '../../components/spot/rand-recom-spot.vue';
  import SiderLayout from '../../components/layout/sider-layout.vue';
  import useArticle from '../../components/article/use-article';

  const route = useRoute();
  const router = useRouter();
  const { onArticleShare, onThumbsUp } = useArticle();

  const articleInfo = ref<ArticleBriefInfo>();
  const spotInfo = ref<SpotBreifInfoModel>();

  const onRedirectUserPreview = (userId: string) => {
    userId = userId || (articleInfo.value?.author.id as string);
    router.push({ name: 'userPreview', params: { userId } });
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

    // const { data: article } = await getArticleById(articleId as string);
    // const { data: spot } = await getSpotBriefInfo(article.spot.id as string);
    // articleInfo.value = article;
    // spotInfo.value = spot;
  };
  init();
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout :limit="10">
      <template #content>
        <div class="m-2 flex-1">
          <h1 class="text-2xl font-semibold p-2 truncate">
            {{ articleInfo?.title }}
          </h1>

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
                  :image-url="articleInfo?.author.avatar"
                  class="mr-2 cursor-pointer"
                  @click.stop="
                    onRedirectUserPreview(articleInfo?.author.id as string)
                  "
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="text-base">
                      {{ articleInfo?.author.username }}
                    </h4>
                    <span>
                      <IconFont type="icon-tuijian2" />
                      <span class="text-xs link-neutral">
                        {{
                          articleInfo?.author.visitors || formatNumber(12012)
                        }}
                      </span>
                    </span>
                  </div>
                  <p class="text-xs w-48 truncate">
                    {{
                      articleInfo?.author.description ||
                      '人之初，性本善，性相近，习相远'
                    }}
                  </p>
                </div>
              </div>

              <!-- 点赞 -->
              <div class="flex items-center mt-10">
                <div class="mr-2">
                  <IconFont type="icon-pinglun3" />
                  <span class="text-xs link-neutral">
                    {{ articleInfo?.commentCount || formatNumber(120012) }}
                  </span>
                </div>
                <div class="mr-2">
                  <IconFont
                    type="icon-dianzan3"
                    class="cursor-pointer icon-click"
                    @click.stop="onThumbsUp(articleInfo?.id as string)"
                  />
                  <span class="text-xs link-neutral">
                    {{ articleInfo?.likeCount || formatNumber(120112) }}
                  </span>
                </div>
                <div class="mr-2">
                  <IconFont
                    type="icon-zhuanfa2"
                    size="13"
                    class="cursor-pointer icon-click"
                    @click.stop="onArticleShare(articleInfo?.id as string)"
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
              :src="articleInfo?.thumbUrl || articleInfo?.spot.thumbUrl"
              :alt="articleInfo?.title"
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
              <span>摘要</span>
            </h3>
            <p class="text-base" style="text-indent: 2rem">
              {{ articleInfo?.summary }}
            </p>
          </div>
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
