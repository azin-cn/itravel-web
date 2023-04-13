<script lang="ts" setup>
  import { ArticleBriefInfo } from '@/api/article';
  import { redirectArticle } from '@/router/utils';
  import { formatNumber } from '@/utils/format';

  export interface IProps {
    list: ArticleBriefInfo[];
    limit: number;
    refresh: () => Promise<void>;
  }

  const props = withDefaults(defineProps<IProps>(), {
    limit: 3,
    refresh: async () => {},
  });
</script>

<template>
  <div v-if="list?.length" class="text-left">
    <div class="m-4">
      <h3 class="text-base inline-block">
        <IconFont type="icon-wenzhang1"></IconFont>
        推荐文章
        <IconFont
          type="icon-shuaxin2"
          size="20"
          class="align-text-top cursor-pointer icon-click-rotate"
          @click.stop="refresh"
        ></IconFont>
      </h3>

      <template v-for="(item, index) in list" :key="item.id">
        <div
          v-if="index < limit"
          class="bg-base-100 p-2 mt-2 mb-2 text-gray-700"
          :style="{
            'border': '1px solid #fff',
            'box-shadow': '0 0 2px 0 #ccc',
            'border-radius': '8px',
          }"
        >
          <h4
            class="text-base cursor-pointer link link-hover w-50 truncate"
            @click.stop="redirectArticle(item.id)"
          >
            {{ item.title }}
          </h4>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="mr-2">
                <IconFont type="icon-pinglun3" />
                <span class="text-xs">
                  {{ item.commentCount || formatNumber(Math.random() * 20000) }}
                </span>
              </div>
              <div class="mr-2">
                <IconFont type="icon-dianzan3" />
                <span class="text-xs link-neutral">
                  {{ item.likeCount || formatNumber(Math.random() * 20000) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .icon-click-rotate {
    transition: all 0.3s;
  }

  .icon-click-rotate:active {
    transform: rotate(-360deg);
    transition: 0s;
  }
</style>
