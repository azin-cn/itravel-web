<script lang="ts" setup>
  import { limitMaxLength, formatNumber } from '@/utils/format';
  import { redirectArticle } from '@/router/utils';
  import { ArticleBriefInfo } from '@/api/article';
  import useArticle from '@/views/components/article/use-article.js';

  export interface IProps {
    list: ArticleBriefInfo[];
    imgUrl?: string;
  }

  const props = defineProps<IProps>();

  const { onArticleShare } = useArticle();
</script>

<template>
  <div v-if="list?.length">
    <template v-for="item in list" :key="item.id">
      <div
        class="card md:card-side bg-base-100 m-1 p-2 mt-2 mb-2 text-gray-700"
        style="border: 1px solid #fff; box-shadow: 0 0 2px 0 #ccc"
      >
        <img
          :src="item.thumbUrl || imgUrl"
          class="rounded-lg shadow-xl hover-img cursor-pointer"
          :alt="item.title"
          :style="{ width: '24%' }"
          loading="lazy"
          @click.stop="redirectArticle(item.id)"
        />
        <div class="card-body">
          <h2
            class="card-title cursor-pointer link link-hover"
            @click.stop="redirectArticle(item.id)"
          >
            {{ item.title }}
          </h2>

          <div class="text-left truncate">
            <p>{{ limitMaxLength(item.summary || item.content) }}</p>
          </div>

          <div class="text-left text-sm">
            <p class="inline-block link-primary">
              <IconFont type="icon-shijian" />
              {{ new Date(item.publishTime).toLocaleString() }}
            </p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="mr-2">
                <IconFont
                  type="icon-pinglun3"
                  class="cursor-pointer icon-click"
                  @click.stop="redirectArticle(item.id)"
                />
                <span class="text-xs link-neutral">
                  {{ item.commentCount || formatNumber(12012012) }}
                </span>
              </div>
              <div class="mr-2">
                <IconFont
                  type="icon-dianzan3"
                  class="cursor-pointer icon-click"
                  @click.stop="() => {}"
                />
                <span class="text-xs link-neutral">
                  {{ item.likeCount || formatNumber(12012012) }}
                </span>
              </div>
              <div class="mr-2" @click="onArticleShare(item.id)">
                <IconFont
                  type="icon-zhuanfa2"
                  size="13"
                  class="cursor-pointer icon-click"
                />
              </div>
            </div>

            <a-tooltip :content="item.author.username" class="text-right">
              <a-avatar :size="28" :image-url="item.author.avatar" />
            </a-tooltip>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div v-else><a-empty /></div>
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

  .hover-img {
    transition: all 0.3s;
  }

  .hover-img:hover {
    transform: scale(1.14);
    transform-origin: 0 center;
  }
</style>
