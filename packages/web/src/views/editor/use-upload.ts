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
        /**
         * 在编辑的情况下，只有url没有file
         */
        if (!item.file) return item.url as string;

        const form = new FormData();
        form.append('file', item.file);
        const {
          data: { url },
        } = await uploadFile(form);
        return url;
      }) || []
    );
    return res;
  };

  return { fileList, uploadImages };
}
