import { ref } from 'vue';

export default function useUpload() {
  const fileList = ref<File[]>();
  return { fileList };
}
