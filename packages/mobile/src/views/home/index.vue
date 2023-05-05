<script lang="ts" setup>
  import { ref } from 'vue';
  import Note from './note/index.vue';

  const activeTab = ref(0);

  const onRedirectProfile = (id: string) => {
    console.log(id);
  };
  const onRedirectSearch = () => {
    console.log('onRedirectSearch');
  };
</script>

<template>
  <van-nav-bar
    title="Itravel"
    safe-area-inset-top
    fixed
    style="height: 2.875rem"
  />
  <div
    class="overflow-hidden h-screen flex flex-col"
    style="padding-top: 2.875rem"
  >
    <van-tabs v-model:active="activeTab" class="flex-1" swipeable sticky shrink>
      <van-tab
        title="笔记"
        title-class="mr-10 max-h-full"
        title-style="hegiht: 2.75rem"
      >
        <div class="p-3 flex items-center" style="height: 3.375rem">
          <van-button
            round
            size="small"
            style="
              color: var(--color-white);
              background-color: var(--itravel-primary-bg);
            "
            @click.stop="onRedirectProfile('')"
          >
            <template #icon>
              <IconFont type="icon-huangguan" />
            </template>
            我的主页
          </van-button>

          <van-field
            :border="false"
            clearable
            placeholder="搜索动态、景点、用户"
            class="flex-1 ml-2 p-0 pl-3 self-center"
            style="
              height: var(--itravel-input-height);
              line-height: var(--itravel-input-height);
              border-radius: var(--itravel-primary-radius);
              background-color: #f4f4f4;
              vertical-align: text-top;
            "
            @focus.stop="onRedirectSearch"
          >
            <template #left-icon>
              <IconFont class="mr-1" type="icon-sousuo"></IconFont>
            </template>
          </van-field>
        </div>
        <Note
          style="
            overflow: scroll;
            width: 96%;
            height: calc(100vh - 2.875rem - 3.375rem);
            margin: 0 auto;
          "
        />
      </van-tab>
      <van-tab title="社区" title-class="mr-10" title-style="hegiht: 2.75rem">
        内容 2
      </van-tab>
      <van-tab
        title="Let's go"
        title-class="mr-10"
        title-style="hegiht: 2.75rem"
      >
        内容 3
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped></style>
