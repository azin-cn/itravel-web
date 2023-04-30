import { ref, Ref } from 'vue';
import useLoading from '@/hooks/loading';
import { ArticleBriefInfo, postComment } from '@/api/article';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';

export default function useRootComment(
  article: Ref<ArticleBriefInfo | undefined>
) {
  const { loading: rootLoading, setLoading: setRootLoading } = useLoading();
  const userStore = useUserStore();
  const rootComment = ref('');

  const resetComment = () => {
    rootComment.value = '';
  };

  const onSubmitRootComment = async () => {
    const { value } = rootComment;
    if (!value) {
      Message.warning('请输入内容');
      return;
    }
    setRootLoading(true);
    try {
      await postComment({
        user: userStore.id as string,
        toUser: article.value?.author.id as string,
        article: article.value?.id as string,
        parent: null,
        content: value,
      });
      Message.success('提交成功');
      resetComment();
    } finally {
      setRootLoading(false);
    }
  };

  return { rootComment, rootLoading, setRootLoading, onSubmitRootComment };
}
