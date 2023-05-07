<template>
  <div class="sc-clamp">
    <div ref="innerRef" class="sc-clamp-inner" :style="clampStyle">
      <slot></slot>
    </div>
    <div v-if="showToggle" class="sc-clamp-btn">
      <a-button type="text" size="mini" @click="toggle = !toggle">
        {{ toggle ? '收起' : '展开' }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';

  interface ClampProps {
    height?: number;
    defaultValue?: boolean;
  }

  const props = withDefaults(defineProps<ClampProps>(), {
    height: 100,
    defaultValue: false,
  });

  const showToggle = ref(true);
  const toggle = ref(props.defaultValue);

  const clampStyle = computed(() => {
    return toggle.value
      ? { height: 'auto' }
      : { maxHeight: `${props.height}px` };
  });

  const innerRef = ref<HTMLDivElement>();

  onMounted(() => {
    if (
      (innerRef.value?.scrollHeight || 0) > (innerRef.value?.clientHeight || 0)
    ) {
      showToggle.value = true;
    }
  });
</script>

<style lang="less">
  .sc-clamp {
    position: relative;
    overflow: hidden;

    &-inner {
      white-space: pre-wrap;
    }

    &-btn {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
</style>
