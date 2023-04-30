import { ref } from 'vue';

export default function usePagination() {
  const page = ref(1);
  const changePage = (v: number) => {
    page.value = v;
  };
  return { page, changePage };
}
