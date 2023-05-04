<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { promiseTimeout } from '@vueuse/core';

  const { loading, setLoading } = useLoading();
  const activeTab = ref(0);
  const count = ref(0);

  const onRefresh = async () => {
    setLoading(true);
    count.value += 1;
    await promiseTimeout(2000);
    setLoading(false);
  };
</script>

<template>
  <van-nav-bar
    title="Itravel"
    safe-area-inset-top
    fixed
    style="height: 2.875rem"
  />
  <div class="h-screen flex flex-col" style="padding-top: 2.875rem">
    <van-tabs v-model:active="activeTab" class="flex-1" swipeable sticky shrink>
      <van-tab title="笔记" title-class="mr-10" title-style="hegiht: ">
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
          <p>刷新次数: {{ count }}</p>
          <div class="itravel-article-card"> </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="社区" title-class="mr-10">内容 2</van-tab>
      <van-tab title="Let's go" title-class="mr-10">内容 3</van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped>
  .itravel-article-card {
    display: grid;
    grid-template-areas:
      'avatar userinfo'
      '. comment'
      '. action'
      '. reply'
      '. children';
    grid-template-rows: 32px auto 24px auto;
    grid-template-columns: 32px auto;
    gap: 0.4rem 0.5rem;
    align-items: center;

    &__avatar {
      grid-area: avatar;
    }

    &__userinfo {
      grid-area: userinfo;
    }

    &__comment {
      grid-area: comment;
    }

    &__action {
      grid-area: action;
    }

    &__reply {
      grid-area: reply;
    }

    &__children {
      grid-area: children;
    }
  }
</style>
