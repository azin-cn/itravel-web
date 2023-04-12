<script lang="ts" setup>
  import { UserState } from '@/store/modules/user/types';
  import { formatNumber } from '@/utils/format';
  import { redirectUserPreview } from '@/router/utils';

  export interface IProps {
    list: UserState[];
    limit: number;
    refresh: () => Promise<void>;
    redirect: (userId: string) => Promise<void> | void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    limit: 3,
    refresh: async () => {},
    redirect: redirectUserPreview,
  });

  const emits = defineEmits(['update:refresh']);
</script>

<template>
  <div class="text-left">
    <div class="m-4">
      <h3 class="text-base inline-block">
        <IconFont type="icon-bianjituijian"></IconFont>
        推荐用户
        <IconFont
          type="icon-shuaxin2"
          size="20"
          class="align-text-top cursor-pointer icon-click-rotate"
          @click.stop="refresh"
        ></IconFont>
      </h3>

      <template v-for="(item, index) in list" :key="item.id">
        <div
          v-if="index < limit"
          class="bg-base-100 p-2 mt-2 mb-2 text-gray-700"
          :style="{
            'border': '1px solid #fff',
            'box-shadow': '0 0 2px 0 #ccc',
            'border-radius': '8px',
          }"
        >
          <div class="flex items-center">
            <a-avatar
              :size="28"
              :image-url="item.avatar"
              class="mr-2 cursor-pointer"
              @click.stop="redirect(item.id as string)"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-base">{{ item.username }}</h4>
                <div>
                  <IconFont type="icon-tuijian2" />
                  <span class="text-xs link-neutral">
                    {{ item.visitors || formatNumber(12012) }}
                  </span>
                </div>
              </div>
              <p class="text-xs w-48 truncate">
                {{ item.description || '人之初，性本善，性相近' }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .icon-click-rotate {
    transition: all 0.3s;
  }

  .icon-click-rotate:active {
    transform: rotate(-360deg);
    transition: 0s;
  }
</style>
