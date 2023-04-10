import { Message } from '@arco-design/web-vue';
import { useClipboard } from '@vueuse/core';

export default function useArticle() {
  const { copy } = useClipboard();
  const onThumbsUp = async (id: string) => {};

  const onArticleShare = async (id: string) => {
    const {
      location: { protocol, host },
    } = window;
    const shareUrl = `${protocol}//${host}/#/article/${id}`;
    await copy(shareUrl);
    Message.success('复制链接成功');
  };

  return { onArticleShare, onThumbsUp };
}
