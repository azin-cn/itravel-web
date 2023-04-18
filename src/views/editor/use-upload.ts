import { ref, watch } from 'vue';
import { FileItem } from '@arco-design/web-vue';
import { uploadFile } from '@/api/upload';

export default function useUpload() {
  const fileList = ref<FileItem[]>();

  watch(fileList, (v) => console.log(v));

  const uploadImages = async (): Promise<string[]> => {
    /**
     * 不能使用forEach，其只支持同步代码
     */
    const res = await Promise.all(
      fileList.value?.map(async (item) => {
        const form = new FormData();
        form.append('file', item.file as File);
        const result = uploadFile(form);
        return result;
      }) || []
    );
    return res.map((item) => item.data.url);
  };

  return { fileList, uploadImages };
}
