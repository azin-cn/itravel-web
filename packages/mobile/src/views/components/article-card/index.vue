<script lang="ts" setup>
  import { ArticleBriefInfo } from '@/api/article';
  import { useClipboard } from '@vueuse/core';
  import useArticleCard from './use-article-card';

  export interface IProps {
    article: ArticleBriefInfo;
  }

  const props = defineProps<IProps>();

  const { copy } = useClipboard();
  const { onArticleShare, onThumbsUp } = useArticleCard();

  const onIconClick = async (id: string, type: 'thumb-up' | 'share') => {
    switch (type) {
      case 'thumb-up':
        onThumbsUp(id);
        break;
      case 'share':
        onArticleShare(id);
        break;
      default:
        break;
    }
  };
</script>

<template>
  <div class="itravel-article-card">
    <!-- 个人信息 -->
    <a-row class="text-center pt-1 pb-1" align="center">
      <a-col :span="4">
        <a-avatar :image-url="article.author.avatar" />
      </a-col>
      <a-col :span="16" class="text-left">
        <a-row>
          <a-col :span="8" class="font-bold truncate">
            {{ article.author.username }}
          </a-col>
          <a-col :span="12" class="truncate text-sm">
            <span
              class="inline-block p-1"
              style="
                color: var(--color-white);
                background-color: var(--itravel-secondary-color);
                border-radius: var(--itravel-third-radius);
              "
            >
              {{ article.author.title || '人间不值得' }}
            </span>
          </a-col>
        </a-row>
        <a-row class="text-xs" style="color: var(--itravel-text-third-color)">
          {{ new Date(article.publishTime).toLocaleDateString() }}
        </a-row>
      </a-col>
      <a-col :span="4" class="text-sm"> <span>关注</span> </a-col>
    </a-row>

    <!-- 文章简略信息展示 -->
    <a-row justify="center" class="pt-1 pb-1">
      <a-col :span="22">
        <a-row class="mt-1 mb-1">
          <a-col :span="14" class="truncate font-bold">
            {{ article.title }}
          </a-col>
        </a-row>
        <a-row style="text-indent: 2rem">
          <a-typography-text
            type="secondary"
            :ellipsis="{
              rows: 2,
            }"
            class="text-sm mt-2 mb-2"
          >
            {{ article.content }}
          </a-typography-text>
        </a-row>
        <a-row>
          <a-image
            width="100%"
            height="170px"
            fit="cover"
            :alt="article.title"
            show-loader
            :src="article.thumbUrl || article.spot.thumbUrl"
            style="border-radius: var(--itravel-secondary-radius)"
            @click.stop="() => {}"
          />
        </a-row>
      </a-col>
    </a-row>

    <!-- 操作栏 -->
    <a-row justify="center" align="center" class="pt-1 pb-1 text-sm">
      <a-col :span="22">
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-row align="center">
              <a-avatar-group :size="24" :max-count="3" z-index-ascend>
                <a-avatar :style="{ backgroundColor: '#14C9C9' }"> A </a-avatar>
                <a-avatar :style="{ backgroundColor: '#FF7D00' }"> B </a-avatar>
                <a-avatar :style="{ backgroundColor: '#FFC72E' }"> C </a-avatar>
              </a-avatar-group>
              <span class="align-middle">等喜欢</span>
            </a-row>
            <a-row class="mt-1" style="color: var(--itravel-text-third-color)">
              共{{ Math.floor(Math.random() * 1000) }}评论
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-space
              fill
              class="float-right"
              style="color: var(--itravel-text-third-color)"
            >
              <IconFont
                type="icon-good"
                :size="16"
                class="icon-click"
                @click.stop="onIconClick(article.id, 'thumb-up')"
              />
              <IconFont
                type="icon-zhuanfa2"
                :size="14"
                class="icon-click"
                @click.stop="onIconClick(article.id, 'share')"
              />
              <IconFont type="icon-pinglun" :size="16" class="icon-click" />
              <IconFont
                type="icon-map-pin-range-fill"
                :size="16"
                class="icon-click"
              />
            </a-space>
          </a-col>
        </a-row>

        <!-- <a-row class="mt-1">
          <a-col>
            <a-row
              v-for="item in 2"
              :key="item"
              style="color: var(--itravel-text-secondary-color)"
              class="mt-1 text-xs"
            >
              <a-col :span="6" class="truncate">人间四月是清明</a-col>
              <a-col :span="14" class="truncate">
                ：太好看了求机位点：太好看了求机位点
              </a-col>
            </a-row>
          </a-col>
        </a-row> -->

        <a-row justify="center" class="mt-2 text-center">
          <a-col>查看更多评论 ></a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
  .itravel-article-card {
    width: 96%;
    margin: 12px auto;
    padding: 16px 4px;
    border-radius: 12px;
    box-shadow: 0 0 12px 2px rgba(131, 131, 131, 0.2);
  }

  .icon-click {
    transition: all 0.3s;
  }

  .icon-click:active {
    transform: scale(1.2);

    /* 解决active时长太短问题 */
    transition: 0s;
  }
</style>
