<script lang="ts" setup>
  import { ref } from 'vue';
  import { FileItem, Message } from '@arco-design/web-vue';
  import useVisible from '@/hooks/visible';
  import useLoading from '@/hooks/loading';
  import { uploadFile } from '@/api/upload';
  import {
    AdminSpotRecord,
    AdminSpotModel,
    getSpotById,
    getAllFeature,
    getAllMonth,
  } from '@/api/list';
  import { BaseModel } from '@/api/base';

  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading();

  const form = ref<Partial<AdminSpotRecord>>({});
  const origin = ref<AdminSpotModel>();
  const months = ref<BaseModel[]>();
  const features = ref<BaseModel[]>();
  const states = ref({
    thumbUrlFiles: [] as FileItem[],
    panoramaFiles: [] as FileItem[],
    changeThumbUrl: false,
    changePanorama: false,
  });
  const fieldNames = {
    label: 'name',
    value: 'id',
  };

  const onClose = () => {
    setVisible(false);
    setLoading(false);
    form.value = {};
    origin.value = undefined;
    states.value.thumbUrlFiles = [];
    states.value.panoramaFiles = [];
    states.value.changePanorama = false;
    states.value.changeThumbUrl = false;
  };

  const onComfirm = async () => {
    setLoading(true);
    try {
      // form.images = await uploadFile();
      Message.info('提交中...');
      Message.info('提交成功');
    } finally {
      setLoading(false);
    }
  };

  const init = async (id: string) => {
    setVisible(true);
    setLoading(true);
    try {
      const [
        { data: spotInfo },
        { data: featureOptions },
        { data: monthOptions },
      ] = await Promise.all([getSpotById(id), getAllFeature(), getAllMonth()]);
      origin.value = spotInfo;
      features.value = featureOptions;
      months.value = monthOptions;
      setLoading(false);
    } catch (_) {
      Message.error('获取景点数据失败');
      onClose();
    }
  };
  defineExpose({ init });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    title="更新景点"
    :footer="false"
    :closable="false"
    :modal-style="{
      borderRadius: '12px',
    }"
    unmount-on-close
  >
    <a-form :model="form" auto-label-width>
      <a-form-item field="id" disabled label="ID">
        <a-input
          v-model="form.id"
          :default-value="(form.id = origin?.id)"
          :placeholder="origin?.id"
        />
      </a-form-item>
      <a-form-item field="name" label="名称" required>
        <a-input
          v-model="form.name"
          :default-value="(form.name ??= origin?.name)"
          :placeholder="origin?.name"
        />
      </a-form-item>
      <a-form-item field="description" label="简介" required>
        <a-textarea
          :max-length="{ length: 300, errorOnly: true }"
          v-model="form.description"
          :default-value="(form.description ??= origin?.description)"
          :placeholder="origin?.description"
          :auto-size="{
            minRows: 5,
          }"
          allow-clear
          show-word-limit
        />
      </a-form-item>
      <a-form-item field="features" label="景点特色" required>
        <a-select
          v-model="form.features"
          :options="features"
          :field-names="fieldNames"
          placeholder="请选择景点特色"
          multiple
          scrollbar
        >
        </a-select>
      </a-form-item>
      <a-form-item field="months" label="适合月份" required>
        <a-select
          v-model="form.months"
          :options="months"
          :field-names="fieldNames"
          placeholder="请选择适合的月份"
          multiple
          scrollbar
        >
        </a-select>
      </a-form-item>
      <a-form-item label="缩略图" tooltip="关闭时默认不更改">
        <a-switch
          v-model="states.changeThumbUrl"
          checked-color="#ff7744"
          unchecked-color="#f2f3f5"
        />
      </a-form-item>
      <a-form-item v-if="states.changeThumbUrl" field="thumbUrl" required>
        <a-upload
          v-model:file-list="states.thumbUrlFiles"
          :auto-upload="false"
          :limit="1"
          list-type="picture-card"
          image-preview
          class="w-2/3"
        >
          <template #retry-icon></template>
        </a-upload>
      </a-form-item>
      <a-form-item label="全景图" tooltip="关闭时默认不更改">
        <a-switch
          v-model="states.changePanorama"
          checked-color="#ff7744"
          unchecked-color="#f2f3f5"
        />
      </a-form-item>
      <a-form-item v-if="states.changePanorama" field="panorama" required>
        <a-upload
          v-model:file-list="states.panoramaFiles"
          :auto-upload="false"
          :limit="1"
          list-type="picture-card"
          image-preview
          class="w-2/3"
        >
          <template #retry-icon></template>
        </a-upload>
      </a-form-item>
    </a-form>
    <a-space fill style="justify-content: center">
      <a-button :disabled="loading" @click.stop="onClose">取消</a-button>
      <a-button :loading="loading" @click.stop="onComfirm">确定</a-button>
    </a-space>
  </a-modal>
</template>
