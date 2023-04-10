<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getHotSpots } from '@/api/spot';
  import type { ITour } from '@/api/spot';
  import { redirectSpot } from '@/router/utils';

  export type MixTour = ITour & {
    clickButton: (articleId: string) => void;
    buttonText?: string;
  };
  export interface IProps {
    pTours?: Array<MixTour>;
    buttonText?: string;
  }
  const props = defineProps<IProps>();

  const router = useRouter();
  const mainTours = ref<ITour[]>();
  const secondaryTours = ref<ITour[]>();

  /**
   * 在数量不足的情况下可以选择不展示
   */
  const onlyShowMainTour = computed(
    () => secondaryTours.value?.length || 0 < 2
  );

  /**
   * 由于 index.vue 中加入 echart 已过于复杂，所以将组件的数据请求放入组件中
   */
  const init = async () => {
    const { data } = await getHotSpots();
    mainTours.value = data.slice(0, 3);
    secondaryTours.value = data.slice(3, 7);
  };
  onMounted(async () => {
    init();
  });
</script>

<template>
  <div>
    <!-- 主要的三个景点 -->
    <section v-if="mainTours?.length">
      <div
        v-for="item in mainTours"
        :key="item.id"
        class="hero min-h-0 p-12 pt-6"
      >
        <div class="hero-content w-full flex-col lg:flex-row-reverse">
          <img
            :src="item.thumbUrl"
            class="max-w-lg rounded-lg shadow-2xl hover-img"
            style="display: block; width: 50%; height: 290px; object-fit: cover"
          />
          <div class="flex-1 md:self-start lg:self-center">
            <h2 class="text-4xl font-bold"> {{ item.name }} </h2>
            <p class="py-6" style="text-indent: 2em">
              {{ item.description }}
              <a class="link link-hover link-primary">[ {{ item.region }} ]</a>
            </p>
            <button
              class="btn btn-primary"
              @click.stop="redirectSpot(item.id as string)"
            >
              {{ buttonText || 'Get Started' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="onlyShowMainTour">
      <div
        class="flex justify-around p-12 max-w-screen-xl mx-auto"
        style="height: 340px"
      >
        <template v-for="(item, index) in secondaryTours" :key="item.id">
          <!-- 前两个 -->
          <div
            v-if="index < 2"
            class="card md:card-side bg-base-100 p-2"
            :style="{
              width: index === 0 ? '46%' : '54%',
            }"
          >
            <img
              :src="item.thumbUrl"
              class="rounded-lg shadow-xl hover-img"
              alt="Movie"
              :style="{
                width: index === 0 ? '38%' : '52%',
              }"
              loading="lazy"
            />
            <div class="card-body">
              <h2 class="card-title">
                <div class="truncate"> {{ item.name }} </div>
              </h2>
              <p style="max-height: 110px; text-indent: 2rem">
                {{ item.description }}
                <a class="link link-hover link-primary">
                  [ {{ item.region }} ]
                </a>
              </p>
              <div class="card-actions justify-end">
                <button
                  class="btn btn-primary"
                  @click.stop="redirectSpot(item.id)"
                >
                  Watch
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div
        class="flex justify-around p-12 max-w-screen-xl mx-auto"
        style="height: 340px"
      >
        <template v-for="(item, index) in secondaryTours" :key="item.id">
          <!-- 后两个 -->
          <div
            v-if="index > 1"
            class="card md:card-side bg-base-100 p-2"
            :style="{
              width: index == 2 ? '54%' : '46%',
            }"
          >
            <img
              :src="item.thumbUrl"
              class="rounded-lg shadow-xl hover-img"
              alt="Movie"
              :style="{
                width: index === 2 ? '52%' : '38%',
              }"
              loading="lazy"
            />
            <div class="card-body">
              <h2 class="card-title">
                <div class="truncate"> {{ item.name }} </div>
              </h2>
              <p style="max-height: 110px; text-indent: 2rem">
                {{ item.description }}
                <a class="link link-hover link-primary">
                  [ {{ item.region }} ]
                </a>
              </p>
              <div class="card-actions justify-end">
                <button
                  class="btn btn-primary"
                  @click.stop="redirectSpot(item.id)"
                >
                  Watch
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
  /* less 结合 tailwind 会出现问题 */
  .card-title {
    min-width: 0;
    max-width: 200px;
  }

  .truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .hover-img {
    transition: all 0.2s;
  }

  .hover-img:hover {
    transform: scale(1.14);
  }
</style>
