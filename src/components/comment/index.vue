<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { formatNumber } from '@/utils/format';
  import { redirectUserPreview } from '@/router/utils';
  import { UserState } from '@/store/modules/user/types';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import ReplyMini from '../reply-mini/index.vue';
  import { IAction } from './types';
  import { useReplyMap } from './use-reply-map';

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
    children?: Comment[];

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
    comments?: Comment[];

    /**
     * 是否展开
     */
    expand?: boolean;
  }

  const props = withDefaults(defineProps<IProps>(), {
    browser: () => ({}),
    comments: () => [],
    expand: false,
  });

  const emits = defineEmits(['action']);

  const { loading: replyLoading, setLoading: setReplyLoading } = useLoading();
  const { showReplyMap, setShowReplyMap } = useReplyMap();
  const childRef = ref();

  const onReply = (
    user: string,
    toUser: string,
    parent: string,
    content: string
  ) => {
    if (!content) {
      Message.warning('请输入内容');
      return;
    }
    setReplyLoading(true);

    emits('action', {
      key: 'reply',
      record: { user, toUser, parent, content },
    } as IAction);
  };
  const onDelete = (id: string) => {
    emits('action', { key: 'delete', record: { id } });
  };

  const onAction = (action: IAction) => {
    const { record } = action;
    setReplyLoading(true);
    emits('action', action);
  };

  const showChildCommentMap = reactive<Map<string, boolean>>(new Map());
  const onShowChildComment = (id: string) => {
    const showChildComment = !showChildCommentMap.get(id);
    showChildCommentMap.set(id, showChildComment);
  };

  /**
   * 当评论提交成功后，可通过hideReply来解除loading和隐藏输入框
   */
  const hideReply = () => {
    setReplyLoading(false);
    showReplyMap.value = new Map([]);
    // console.log(childRef.value);
    childRef.value?.forEach((item: any) => item?.hideReply());
  };

  defineExpose({ hideReply, setReplyLoading });
</script>

<script lang="ts">
  export default {
    name: 'Comment',
  };
</script>

<template>
  <div
    v-for="comment of comments"
    :key="comment.id"
    class="itravel-comment mb-2"
  >
    <a-avatar
      :size="32"
      :image-url="comment.user.avatar"
      alt="avatar"
      class="mr-2 cursor-pointer itravel-comment__avatar"
      @click.stop="redirectUserPreview(comment.user.id as string)"
    />

    <div class="text-sm itravel-comment__userinfo">
      <!-- 目前仅有静态模板，后续完善信息展示交互 -->
      <p class="text-base">
        {{ comment.user.username }}
        <span v-if="comment.parent">
          <span class="text-gray-500 ml-2 mr-2">回复</span>
          {{ comment?.toUser.username }}
        </span>
      </p>
      <!-- 处于子评论/回复时隐藏 -->
      <p v-if="!comment.parent" class="text-gray-400 truncate w-1/2">
        {{ comment.user.description || '人之初，性本善。性相近，习相远' }}
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
        @click.stop="setShowReplyMap(comment.id)"
      >
        <IconFont type="icon-pinglun3" class="icon-click" />
        <!-- 只有为true才显示取消评论，否则一律显示评论按钮 -->
        <span v-if="showReplyMap?.get(comment.id)" class="ml-1 link-accent">
          取消评论
        </span>
        <span v-else class="ml-1">评论</span>
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
        @click.stop="onDelete(comment.id as string)"
      >
        <IconFont type="icon-shanchu2" />
        <span class="ml-1">删除</span>
      </span>
    </div>

    <!-- 回复时，由当前的浏览者发起，由当前的评论人接收 -->
    <!-- 回复组件中一定含有parent，要么是comment.parent.id 要么是 comment.id，根评论中特殊处理只能是null -->
    <Transition name="fade" mode="out-in">
      <ReplyMini
        v-if="showReplyMap?.get(comment.id)"
        class="itravel-comment__reply"
        :loading="replyLoading"
        @reply="(v: string) => 
          onReply(
            browser?.id as string, 
            comment?.user.id as string, 
            (comment.parent?.id || comment.id) as string, 
            v
        )"
      />
    </Transition>

    <!-- children 递归终止 -->
    <div v-if="comment.children?.length" class="itravel-comment__children">
      <Transition name="zoom" mode="out-in">
        <div>
          <Comment
            v-if="showChildCommentMap?.get(comment.id)"
            ref="childRef"
            :comments="comment.children"
            @action="onAction"
          />
          <!-- 是否展示children -->
          <div
            class="-mt-2 mb-2 inline-block link-accent cursor-pointer text-base text-gray-500"
            @click.stop="onShowChildComment(comment.id)"
          >
            {{ showChildCommentMap?.get(comment.id) ? '收起回复' : '展开回复' }}
            <IconFont
              type="icon-xiangxiajiantoux"
              :class="showChildCommentMap?.get(comment.id) ? 'rotate-180' : ''"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="less">
  .itravel-comment {
    display: grid;
    grid-template-areas:
      'avatar userinfo'
      '. comment'
      '. action'
      '. reply'
      '. children';
    grid-template-rows: 32px auto 24px auto;
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

    &__reply {
      grid-area: reply;
    }

    &__children {
      grid-area: children;
    }
  }

  .zoom-enter-active,
  .zoom-leave-active {
    transition: all 1s ease;
  }

  .zoom-enter,
  .zoom-leave-to {
    height: 0;
  }
</style>
