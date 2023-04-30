<script lang="ts" setup>
  import { ref } from 'vue';

  export interface IProps {
    minRows?: number;
    maxRows?: number;
    maxLength?: number;
    btnText?: string;
    placeholder?: string;
    loading?: boolean;
  }

  const props = withDefaults(defineProps<IProps>(), {
    minRows: 2,
    maxRows: 10,
    maxLength: 100,
    btnText: '发送',
    placeholder: '在这里输入你的观点吧！',
  });
  const emits = defineEmits(['reply']);
  const comment = ref('');

  const onReply = () => {
    const { value } = comment;
    emits('reply', value);
  };
</script>

<template>
  <div class="w-full mb-6 flex items-center">
    <a-textarea
      v-model="comment"
      :auto-size="{
        minRows,
        maxRows,
      }"
      :max-length="maxLength"
      allow-clear
      show-word-limit
      :placeholder="placeholder"
      :style="{
        'border-color': 'rgb(227 227 228 / 100%)',
        'border-radius': '6px',
      }"
      class="mr-3"
    >
    </a-textarea>
    <a-button :loading="loading" @click.stop="onReply">{{ btnText }}</a-button>
  </div>
</template>
