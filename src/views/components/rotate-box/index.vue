<script lang="ts" setup>
  import { ref } from 'vue';

  export interface IProps {
    id?: string;
    urls?: string[];
    request?: (...args: unknown[]) => string | Promise<string>;
  }

  const props = withDefaults(defineProps<IProps>(), {
    urls: () => [],
  });

  const boxRef = ref<HTMLElement>();
</script>

<template>
  <ul ref="boxRef" class="itravel-rotate-box cursor-pointer">
    <li
      v-for="item in urls"
      :key="item"
      class="itravel-rotate-box-item"
      :style="{
        backgroundImage: `url('${item}')`,
      }"
    ></li>
    <!-- 面补充 -->
    <li
      v-for="item in 6 - urls.length"
      :key="item"
      class="itravel-rotate-box-item"
      :style="{
        backgroundImage: `url('${item}')`,
      }"
    ></li>
  </ul>
</template>

<style scoped lang="less">
  .itravel-rotate-box {
    position: relative;
    list-style: none;
    transform-origin: center;
    transform-style: preserve-3d;
    perspective: 1000px;
    animation: rotate-box 3.3s linear forwards infinite;
  }

  .itravel-rotate-box-item {
    position: absolute;
    background-size: cover;
    transition: all 0.4s;
  }

  .itravel-rotate-box-item::before {
    display: block;
    width: 48px;
    height: 48px;
    border-radius: 2px;
    box-shadow: inset 0 0 8px -3px #432a0c;
    content: '';
  }

  .itravel-rotate-box-item:nth-child(1) {
    transform: translateZ(24px);
  }

  .itravel-rotate-box-item:nth-child(2) {
    transform: translateX(24px) rotateY(90deg);
  }

  .itravel-rotate-box-item:nth-child(3) {
    transform: translateZ(-24px) rotateY(180deg);
  }

  .itravel-rotate-box-item:nth-child(4) {
    transform: translateX(-24px) rotateY(-90deg);
  }

  .itravel-rotate-box-item:nth-child(5) {
    transform: translateY(-24px) rotateX(90deg);
  }

  .itravel-rotate-box-item:nth-child(6) {
    transform: translateY(24px) rotateX(-90deg);
  }

  .itravel-rotate-box:hover {
    .itravel-rotate-box-item:nth-child(1) {
      transform: translateZ(40px);
    }

    .itravel-rotate-box-item:nth-child(2) {
      transform: translateX(40px) rotateY(90deg);
    }

    .itravel-rotate-box-item:nth-child(3) {
      transform: translateZ(-40px) rotateY(180deg);
    }

    .itravel-rotate-box-item:nth-child(4) {
      transform: translateX(-40px) rotateY(-90deg);
    }

    .itravel-rotate-box-item:nth-child(5) {
      transform: translateY(-40px) rotateX(90deg);
    }

    .itravel-rotate-box-item:nth-child(6) {
      transform: translateY(40px) rotateX(-90deg);
    }
  }

  /* 可以将rotate-box放入item中 */
  @keyframes rotate-box {
    from {
      /* transform: rotate3d(0, 0, 0, 0deg); */
    }

    to {
      /* transform: rotate3d(0.1, 0.1, 0.1, 720deg); */
      transform: rotate3d(0.1, 0.1, 0.02, -720deg);
    }
  }
</style>
