import { ref } from 'vue';

export const globalShowReplyMap = ref<Map<string, boolean>>(new Map());

export function useReplyMap(global = true) {
  const showReplyMap = global
    ? globalShowReplyMap
    : ref<Map<string, boolean>>();

  /**
   * onShowReply 只能展示一个回复输入框
   */
  const setShowReplyMap = (id: string) => {
    const showReply = !showReplyMap.value?.get(id);
    if (showReply) {
      /**
       * entry type
       * [
       *   [key, value],
       * ]
       */
      const map = new Map([[id, true]]);
      showReplyMap.value = map;
    } else {
      showReplyMap.value = new Map([]);
    }
  };

  return {
    showReplyMap,
    globalShowReplyMap,
    setShowReplyMap,
  };
}
