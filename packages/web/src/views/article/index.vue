<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { IPaginationOpton } from '@/api/base';
  import {
    getArticleById,
    getCommentsByArticleId,
    ArticleBriefInfo,
    postComment,
  } from '@/api/article';
  import { getSpotBriefInfo, SpotBreifInfoModel } from '@/api/spot';
  import { useUserStore } from '@/store';
  import { formatNumber } from '@/utils/format';
  import { setDocumentTitle } from '@/utils/window';
  import IComment, { Comment } from '@/components/comment/index.vue';
  import { IAction } from '@/components/comment/types';
  import { ListResult } from '@/types/global';
  import RandRecomSpot from './components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
  import useArticle from '../components/article/use-article';
  import useRootComment from './use-root-comment';
  import IPagination from '../components/pagination/index.vue';
  import { DEFAULT_PAGINATION_LIMIT } from './constants';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const { onArticleShare, onThumbsUp } = useArticle();

  const genDefaultImgs = () => [
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp',
  ];

  const commentRef = ref<InstanceType<typeof IComment>>();
  const articleInfo = ref<ArticleBriefInfo>();
  const spotInfo = ref<SpotBreifInfoModel>();
  const comments = ref<ListResult<Comment>>();

  const {
    rootComment,
    rootLoading,
    setRootLoading,
    onSubmitRootComment: onSubmit,
  } = useRootComment(articleInfo);

  const onRedirectUserPreview = (userId: string) => {
    userId = userId || (articleInfo.value?.author.id as string);
    router.push({ name: 'userPreview', params: { userId } });
  };
  const onRedirectEditor = (articleId: string) => {
    router.push({ name: 'editor', params: { articleId } });
  };

  const getArticle = async (articleId: string) => {
    const { data } = await getArticleById(articleId);
    articleInfo.value = data;
  };

  const getSpot = async (spotId: string) => {
    const { data } = await getSpotBriefInfo(spotId);
    spotInfo.value = data;
  };

  const page = ref(1);
  const getComments = async (
    articleId: string,
    options: IPaginationOpton = { page: 1, limit: DEFAULT_PAGINATION_LIMIT }
  ) => {
    const { data } = await getCommentsByArticleId(articleId, options);
    comments.value = data;
  };

  const onCommentPageChange = async (v: number) => {
    page.value = v;
    await getComments(articleInfo.value?.id as string, {
      page: v,
      limit: DEFAULT_PAGINATION_LIMIT,
    });
  };

  const onSubmitRootComment = async () => {
    await onSubmit();
    await getComments(articleInfo.value?.id as string, {
      page: page.value,
      limit: DEFAULT_PAGINATION_LIMIT,
    });
  };

  const onAction = async (action: IAction) => {
    const { key, record } = action;
    switch (key) {
      case 'reply':
        // network
        try {
          await postComment({
            user: (record.user || userStore.id) as string,
            toUser: record.toUser as string,
            content: record.content as string,
            parent: record.parent as string,
            article: articleInfo.value?.id as string,
          });
          Message.success('发送成功');
          commentRef.value?.hideReply();
          getComments(articleInfo.value?.id as string, {
            page: page.value,
            limit: DEFAULT_PAGINATION_LIMIT,
          });
        } catch (e) {
          Message.error((e as Error).message || '提交失败');
          commentRef.value?.setReplyLoading(false);
        }
        break;
      default:
        break;
    }
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
    // promise.all
    await Promise.all([
      getArticle(articleId as string),
      getComments(articleId as string),
    ]);
    await getSpot(articleInfo.value?.spot.id as string);

    setDocumentTitle(
      `${articleInfo.value?.author.username} | ${articleInfo.value?.title}`
    );
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
                <div
                  v-if="userStore.id && articleInfo?.author.id === userStore.id"
                  class="mr-2 cursor-pointer link-hover"
                  @click.stop="onRedirectEditor(articleInfo?.id as string)"
                >
                  <IconFont
                    type="icon-xiewenzhang"
                    size="13"
                    class="icon-click"
                  />
                  <span class="text-sm">编辑</span>
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
              {{ articleInfo?.summary || '暂无内容' }}
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
                v-for="item in articleInfo?.images || genDefaultImgs()"
                :key="item"
                :src="item"
                height="160"
                width="100%"
                fit="cover"
                class="m-1 cursor-pointer overflow-hidden"
                style="width: 32% !important; border-radius: 6px"
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

            <div class="p-6">
              <div class="mb-6 flex items-center">
                <a-textarea
                  v-model="rootComment"
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
                  allow-clear
                  placeholder="在这里输入你的观点吧！"
                  class="mr-3"
                >
                </a-textarea>
                <a-button
                  :loading="rootLoading"
                  @click.stop="onSubmitRootComment"
                >
                  发送
                </a-button>
              </div>
              <IComment
                ref="commentRef"
                :browser="userStore.userInfo"
                :comments="comments?.list"
                @action="onAction"
              />
              <IPagination
                :on-page-change="onCommentPageChange"
                :page="page"
                :total="comments?.total"
              />
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
</style>
