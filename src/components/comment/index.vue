<script lang="ts" setup>
  import { ref } from 'vue';
  import { formatNumber } from '@/utils/format';
  import { UserState } from '@/store/modules/user/types';
  import ReplyMini from '../reply-mini/index.vue';

  export interface Comment {
    /**
     * 当前评论id
     */
    id: string;

    /**
     * 父级评论
     */
    parent: Comment | null;

    /**
     * 发起评论的用户
     */
    user: Partial<UserState>;

    /**
     * 接受评论的用户
     */
    toUser: Partial<UserState>;

    /**
     * 评论内容
     */
    content: string;

    /**
     * 子评论/回复
     */
    children: Comment[];

    /**
     * 创建时间
     */
    createdTime: string;

    /**
     * 更新时间
     */
    updatedTime: string;
  }

  export interface IProps {
    /**
     * 当前用户
     */
    browser: Partial<UserState>;

    /**
     * 评论数据
     */
    comments: Comment[];
  }

  const props = withDefaults(defineProps<IProps>(), {
    browser: () => ({}),
    comments: () => [],
  });

  const emits = defineEmits(['reply']);

  const showReply = ref(false);

  const onReply = (userId: string, toUserId: string, v: string) => {
    emits('reply', v);
  };
</script>

<template>
  <div v-for="comment of comments" :key="comment.id" class="itravel-comment">
    <a-avatar
      :size="32"
      :image-url="comment.user.avatar"
      alt="avatar"
      class="mr-2 cursor-pointer itravel-comment__avatar"
    />

    <div class="text-sm itravel-comment__userinfo">
      <p class="text-base">{{ comment.user.username }}</p>
      <!-- 处于子评论/回复时隐藏 -->
      <p v-if="!comment.parent" class="text-gray-400">
        {{ comment.user.description }}
      </p>
    </div>

    <div class="text-base itravel-comment__comment">
      {{ comment.content }}
    </div>

    <div class="text-sm text-gray-400 itravel-comment__action">
      <span class="mr-3 hover:link-accent">
        <IconFont type="icon-dianzan6" class="cursor-pointer icon-click" />
        <span class="ml-1">
          {{ formatNumber(Math.random() * 1000) }}
        </span>
      </span>
      <span
        class="mr-3 cursor-pointer hover:link-accent"
        @click.stop="showReply = !showReply"
      >
        <IconFont type="icon-pinglun3" class="icon-click" />
        <span class="ml-1">{{ showReply ? '取消评论' : '评论' }}</span>
      </span>
      <span class="mr-3">
        <IconFont type="icon-shijian4" />
        <span class="ml-1">
          {{ new Date(comment.createdTime).toLocaleString() }}
        </span>
      </span>
      <!-- 如果当前用户的id === 发起评论的人，则允许删除 -->
      <span
        v-if="browser.id === comment.user.id"
        class="mr-3 cursor-pointer hover:link-warning"
      >
        <IconFont type="icon-shanchu2" />
        <span class="ml-1">删除</span>
      </span>
    </div>

    <!-- 回复时，由当前的浏览者发起，由当前的评论人接收 -->
    <ReplyMini
      v-if="showReply"
      @reply="(v: string) => onReply(browser.id, comment.user.id, v)"
    />

    <!-- children -->
  </div>
</template>

<style lang="less" scoped>
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
