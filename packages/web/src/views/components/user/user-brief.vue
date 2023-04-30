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
  <a-space wrap :size="24">
    <template v-for="(item, index) in list" :key="item.id">
      <div
        v-if="index < limit"
        class="p-2 mt-2 mb-2 bg-base-100 text-gray-700 w-full"
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
                  {{ item.visitors || formatNumber(Math.random() * 10000) }}
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
  </a-space>
</template>
