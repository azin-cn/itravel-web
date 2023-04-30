<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';

  export interface IProps {
    /**
     * Vditor 内部引用type
     */
    options?: any;
  }

  const props = withDefaults(defineProps<IProps>(), {
    options: () => ({}),
  });

  const genDefaultOptions = (): any => ({
    height: 492,
    width: '100%',
    mode: 'wysiwyg',
    _lutePath:
      'https://cdn.jsdelivr.net/npm/vditor@3.8.13/dist/js/lute/lute.min.js',
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      // 'upload',
      // 'record',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      // 'edit-mode',
      'content-theme',
      'code-theme',
      'export',
      {
        name: 'more',
        toolbar: ['fullscreen', 'both', 'preview'],
      },
    ],
    toolbarConfig: {
      pin: true,
    },
    placeholder: 'Hello, Itravel!',
    icon: 'ant',
    preview: {
      markdown: {
        toc: true,
        mark: true,
        footnotes: true,
        autoSpace: true,
      },
      math: {
        engine: 'KaTeX',
      },
    },
    outline: {
      enable: true,
      position: 'left',
    },
    counter: {
      enable: true,
      type: 'text',
    },
    typewriterMode: true,
    resize: {
      enable: true,
      position: 'bottom',
    },
  });

  const vditorRef = ref<Vditor>();
  onMounted(() => {
    vditorRef.value = new Vditor('vditor', {
      ...genDefaultOptions,
      ...props.options,
    });
  });

  defineExpose({ vditor: vditorRef });
</script>

<template>
  <div id="vditor" />
</template>
