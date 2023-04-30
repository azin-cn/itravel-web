<script lang="ts" setup>
  import RotateBox from '@/views/components/rotate-box/index.vue';
  import useFM from '../use-fm';

  export interface IMonthOrFeature {
    id: string;
    name: string;
  }
  export interface IProps {
    features: IMonthOrFeature[];
    months: IMonthOrFeature[];
    province?: string;
    city?: string;
  }
  const props = defineProps<IProps>();

  const emits = defineEmits(['click3d']);

  const { months: allMonths, features: allFeatures } = useFM();

  const hasMonth = (name: string) => {
    return props.months.find((item) => item.name === name);
  };
  const hasFeature = (name: string) => {
    return props.features.find((item) => item.name === name);
  };
</script>

<template>
  <div class="flex items-center justify-between">
    <section class="pl-28">
      <a-tooltip content="点击进入VR空间">
        <RotateBox @click.stop="emits('click3d')"></RotateBox>
      </a-tooltip>
    </section>
    <section class="text-right">
      <div v-if="features?.length">
        <kbd
          v-for="item in allFeatures"
          :key="item.name"
          class="kbd kbd-sm m-1 p-1"
        >
          <div class="text-center align-middle">
            <IconFont v-if="hasFeature(item.name)" type="icon--"></IconFont>
            <span>{{ item.name }}</span>
          </div>
        </kbd>
      </div>

      <div v-if="months?.length">
        <kbd
          v-for="item in allMonths"
          :key="item.name"
          class="kbd kbd-sm m-1 p-1"
        >
          <div class="text-center align-middle">
            <IconFont
              v-if="hasMonth(item.name)"
              type="icon-zhishipai"
            ></IconFont>
            <span>{{ item.name }}</span>
          </div>
        </kbd>
      </div>

      <div class="text-right">
        <kbd v-if="province" class="kbd kbd-sm m-1 p-1">
          <div class="text-center align-middle">
            <IconFont type="icon-mianxinglupaizhishipai"></IconFont>
            <span>{{ province }}</span>
          </div>
        </kbd>
        <kbd v-if="city" class="kbd kbd-sm m-1 p-1">
          <div class="text-center align-middle">
            <IconFont type="icon-mianxinglupaizhishipai"></IconFont>
            <span>{{ city }}</span>
          </div>
        </kbd>
      </div>
    </section>
  </div>
</template>
