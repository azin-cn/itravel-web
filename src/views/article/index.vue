<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getArticleById, ArticleBriefInfo } from '@/api/article';
  import { getSpotBriefInfo, SpotBreifInfoModel } from '@/api/spot';
  import { useUserStore } from '@/store';
  import { formatNumber } from '@/utils/format';
  import { setDocumentTitle } from '@/utils/window';
  import RandRecomSpot from './components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
  import useArticle from '../components/article/use-article';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
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
    const { articleId } = params;
    if (!articleId) {
      router.push({ name: 'home' });
      return;
    }

    const { data: article } = await getArticleById(articleId as string);
    const { data: spot } = await getSpotBriefInfo(article.spot.id as string);
    articleInfo.value = article;
    spotInfo.value = spot;

    setDocumentTitle(`${article.author.username} | ${article.title}`);
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
                          articleInfo?.author.visitors ||
                          formatNumber(Math.random() * 2000)
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
                    {{
                      articleInfo?.commentCount ||
                      formatNumber(Math.random() * 20000)
                    }}
                  </span>
                </div>
                <div class="mr-2">
                  <IconFont
                    type="icon-dianzan3"
                    class="cursor-pointer icon-click"
                    @click.stop="onThumbsUp(articleInfo?.id as string)"
                  />
                  <span class="text-xs link-neutral">
                    {{
                      articleInfo?.likeCount ||
                      formatNumber(Math.random() * 20000)
                    }}
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

          <!-- 文章主体 -->
          <div class="text-left mt-6 mb-6">
            <h3 class="mb-2 text-lg font-semibold inline-block">
              <IconFont
                type="icon--"
                size="24"
                class="mr-2 align-text-bottom"
              />
              <span>正文</span>
            </h3>
            <p class="text-base" style="text-indent: 2rem">
              {{ articleInfo?.content }}
            </p>
          </div>

          <!-- 图片预览 -->
          <div class="text-left">
            <a-image-preview-group infinite>
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp"
                class="w-1/3 p-1 pb-0 cursor-pointer"
                style="border-radius: 6px"
              />
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp"
                class="w-1/3 p-1 pb-0 cursor-pointer"
                style="border-radius: 6px"
              />
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp"
                class="w-1/3 p-1 pb-0 cursor-pointer"
                style="border-radius: 6px"
              />
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp"
                class="w-1/3 p-1 pb-0 cursor-pointer"
                style="border-radius: 6px"
              />
            </a-image-preview-group>
          </div>

          <!-- 评论 -->
          <div class="text-left mt-6">
            <h3 class="mb-2 text-lg font-semibold inline-block">
              <IconFont
                type="icon--"
                size="24"
                class="mr-2 align-text-bottom"
              />
              <span>评论</span>
            </h3>

            <div class="p-4">
              <div class="mb-6 flex items-center">
                <a-textarea
                  placeholder="在这里输入你的观点吧！"
                  allow-clear
                  :auto-size="{
                    minRows: 2,
                    maxRows: 10,
                  }"
                  show-word-limit
                  :max-length="100"
                  :style="{
                    'border-color': 'rgb(227 227 228 / 100%)',
                    'border-radius': '6px',
                  }"
                  class="mr-3"
                >
                </a-textarea>
                <a-button>发送</a-button>
              </div>
              <div>
                <!-- item -->
                <div class="itravel-comment">
                  <a-avatar
                    :size="32"
                    alt="avatar"
                    class="mr-2 cursor-pointer itravel-comment__avatar"
                    image-url="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                  />

                  <div class="text-sm itravel-comment__userinfo">
                    <p class="text-base">luckydog</p>
                    <p v-if="userStore.id" class="text-gray-400">
                      人之初，性本善，性相近，习相远
                    </p>
                  </div>

                  <div class="text-base itravel-comment__comment">
                    校友，你还有offer，我还是0。实在不行，先找个干着吧，付费上班也不是不行，手动狗头
                  </div>

                  <div class="text-sm text-gray-400 itravel-comment__action">
                    <span class="mr-3 hover:link-accent">
                      <IconFont
                        type="icon-dianzan6"
                        class="cursor-pointer icon-click"
                      />
                      <span class="ml-1">
                        {{ formatNumber(Math.random() * 1000) }}
                      </span>
                    </span>
                    <span class="mr-3 cursor-pointer hover:link-accent">
                      <IconFont type="icon-pinglun3" class="icon-click" />
                      <span class="ml-1">评论</span>
                    </span>
                    <span class="mr-3">
                      <IconFont type="icon-shijian4" />
                      <span class="ml-1">
                        {{ new Date().toLocaleString() }}
                      </span>
                    </span>
                    <span
                      v-if="userStore.id"
                      class="mr-3 cursor-pointer hover:link-warning"
                    >
                      <IconFont type="icon-shanchu2" />
                      <span class="ml-1">删除</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </SiderLayout>

    <RandRecomSpot></RandRecomSpot>
  </div>
</template>

<style scoped lang="less">
  .icon-click {
    transition: all 0.3s;
  }

  .icon-click:active {
    transform: scale(1.2);

    /* 解决active时长太短问题 */
    transition: 0s;
  }

  .itravel-comment {
    display: grid;
    grid-template-areas:
      'avatar userinfo'
      '. comment'
      '. action';
    grid-template-rows: 32px auto 24px;
    grid-template-columns: 32px auto;
    gap: 0.6rem 0.5rem;
    align-items: center;

    &__avatar {
      grid-area: avatar;
    }

    &__userinfo {
      grid-area: userinfo;
    }

    &__comment {
      grid-area: comment;
    }

    &__action {
      grid-area: action;
    }
  }
</style>
