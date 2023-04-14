<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { ArticleBriefInfo, getArticleById } from '@/api/article';
  import { setDocumentTitle } from '@/utils/window';
  import SiderLayout from '../components/layout/sider-layout.vue';

  const genDefaultForm = (): Partial<ArticleBriefInfo> => ({
    images: [],
  });

  const route = useRoute();
  const router = useRouter();

  const vditorRef = ref<Vditor>();
  const articleForm = ref<Partial<ArticleBriefInfo>>(genDefaultForm());
  const isUpdated = ref(false);

  const onSubmit = async () => {};

  const init = async () => {
    const { params } = route;
    const { articleId } = params;

    if (articleId) {
      isUpdated.value = true;
      const { data } = await getArticleById(articleId as string);
      articleForm.value = data;

      setDocumentTitle(`编辑文章 - ${data.title}`);
    } else {
      setDocumentTitle(`创建文章`);
    }
  };
  init();

  onMounted(() => {
    vditorRef.value = new Vditor('vditor', {
      height: 492,
      minHeight: 100,
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
      cache: {
        enable: false,
      },
      input(md: string) {
        console.log(md);
      },
    });
  });

  const fileList = [
    {
      uid: '-2',
      name: '20200717-103937.png',
      url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
    },
    {
      uid: '-1',
      name: 'hahhahahahaha.png',
      url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
    },
  ];
</script>

<template>
  <div>
    <SiderLayout>
      <template #content>
        <div class="m-4 mb-0 text-left">
          <!-- 标题 -->
          <div class="flex justify-between items-center">
            <input
              type="text"
              placeholder="输入文章标题"
              class="input input-bordered input-md w-full text-base"
            />
            <!-- v-model:value="" -->
            <button class="btn btn-ghost btn-info ml-2" @click.stop="() => {}">
              提交
            </button>
          </div>
          <!-- 内容 -->
          <div id="vditor" class="mt-4" />
          <!-- 标题 -->
          <div class="m-6 ml-0">
            <h2 class="text-lg link link-hover inline-block">
              <IconFont type="icon-zhilupai"></IconFont>
              更多
            </h2>
          </div>

          <div class="flex">
            <!-- 图库 -->
            <a-upload
              list-type="picture-card"
              action="/"
              image-preview
              :default-file-list="fileList"
              class="w-2/3"
            />
            <a-form :model="{}" class="w-2/5 itravel-editor-form">
              <a-form-item field="spot" label="景点" tooltip="请选择关联景点">
                <a-select placeholder="请输入关联景点">
                  <a-option>Beijing</a-option>
                  <a-option>Shanghai</a-option>
                  <template #footer>
                    <div class="text-center text-sm text-gray-400">
                      默认展示10条，更多请搜索
                    </div>
                  </template>
                </a-select>
              </a-form-item>
              <a-form-item
                field="category"
                label="分类"
                tooltip="请选择文章分类"
              >
                <a-select placeholder="请选择文章分类">
                  <a-option>Beijing</a-option>
                  <a-option>Shanghai</a-option>
                  <template #footer>
                    <div class="text-center text-sm text-gray-400">
                      默认展示10条，更多请搜索
                    </div>
                  </template>
                </a-select>
              </a-form-item>

              <a-form-item field="tags" label="标签" tooltip="请选择文章标签">
                <a-select
                  placeholder="请选择文章标签"
                  multiple
                  :limit="4"
                  :max-tag-count="2"
                  scrollbar
                >
                  <a-option>Guangzhou</a-option>
                  <a-option>Shenzhen</a-option>
                  <template #footer>
                    <div class="text-center text-sm text-gray-400">
                      默认展示10条，更多请搜索
                    </div>
                  </template>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </template>
    </SiderLayout>
  </div>
</template>

<style lang="less">
  .itravel-editor-form {
    .arco-select-view-single:focus-within,
    .arco-select-view-single.arco-select-view-focus {
      border-color: unset;
    }

    .arco-form-item .arco-select-view-multiple:focus-within,
    .arco-form-item .arco-select-view-multiple.arco-select-view-focus {
      border-color: unset !important;
    }

    .arco-checkbox.arco-checkbox-checked
      span.arco-icon-hover.arco-icon-hover-disabled.arco-checkbox-icon-hover
      .arco-checkbox-icon {
      background-color: white !important;

      svg.arco-checkbox-icon-check {
        color: unset;
      }
    }
  }
</style>
