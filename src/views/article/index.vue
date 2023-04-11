<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getArticleById, ArticleBriefInfo } from '@/api/article';
  import { formatNumber } from '@/utils/format';
  import RandRecomSpot from './components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';

  const route = useRoute();
  const router = useRouter();

  const articleInfo = ref<ArticleBriefInfo>();

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

    const { data } = await getArticleById(articleId as string);
    articleInfo.value = data;
  };

  init();
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout>
      <template #content>
        <div class="m-2 flex-1">
          <h1 class="text-2xl font-semibold p-2 truncate">
            {{ articleInfo?.title }}
          </h1>

          <!-- 作者介绍和缩略图 -->
          <div class="flex items-stretch">
            <div
              class="flex items-center bg-base-100 p-2 mt-2 mb-2 text-gray-700"
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
                  @click.stop="() => {}"
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
              <div class="flex items-center">
                <div class="mr-2">
                  <IconFont type="icon-pinglun3" 、 />
                  <span class="text-xs link-neutral">
                    {{ articleInfo?.commentCount || formatNumber(120012) }}
                  </span>
                </div>
                <div class="mr-2">
                  <IconFont
                    type="icon-dianzan3"
                    class="cursor-pointer icon-click"
                    @click.stop="() => {}"
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
                  />
                </div>
              </div>
            </div>

            <div
              class="flex-1 relative overflow-hidden p-2 m-2"
              style="height: 216px; border-radius: 8px"
            >
              <img
                src="https://tse1-mm.cn.bing.net/th/id/OIP-C.xc5KsKdO2u9T5hBCpE0yCgHaEK?pid=ImgDet&rs=1"
                :alt="articleInfo?.title"
                class="absolute top-1/2 left-1/2 w-full h-full"
                style="object-fit: cover; transform: translate(-50%, -50%)"
              />
            </div>
          </div>

          <!-- 文章主体 -->

          <!-- <a-image-preview-group infinite>
            <a-space>
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp"
                width="200"
              />
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp"
                width="200"
              />
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp"
                width="200"
              />
              <a-image
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp"
                width="200"
              />
            </a-space>
          </a-image-preview-group> -->
        </div>
      </template>
    </SiderLayout>

    <RandRecomSpot></RandRecomSpot>
  </div>
</template>

<style scoped></style>
