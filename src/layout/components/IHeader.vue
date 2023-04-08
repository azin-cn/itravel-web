<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import { isLogin as isLoginFunc } from '@/utils/auth';
  import * as settings from '@/config/settings.json';
  import avatar from '@/assets/images/avatar.jpg';
  import avatarNoLogin from '@/assets/images/avatar-no-login.png';
  import ModalForm from './modal-form.vue';

  const router = useRouter();
  const userStore = useUserStore();

  const modalRef = ref<InstanceType<typeof ModalForm>>();

  const isLogin = computed(() => {
    return isLoginFunc();
  });

  const onSearch = () => {
    modalRef.value?.init();
  };

  const onLogout = async () => {
    await userStore.logout();
    window.location.reload();
  };

  const onLogin = () => {
    router.push({
      name: 'login',
    });
  };
</script>

<template>
  <div
    style="position: sticky; top: 0; z-index: 1"
    class="bg-base-100 text-gray-700"
  >
    <div class="navbar bg-opacity-50 pl-36 pr-36 pt-4 pb-4">
      <div class="flex-1">
        <!-- Title -->
        <router-link to="/" class="btn btn-ghost normal-case text-2xl">
          {{ settings?.title }}
        </router-link>

        <div class="tabs md:space-x-8 md:ml-24">
          <router-link to="/home" class="router-link tab-active">
            主页
          </router-link>
          <router-link to="/explore" class="router-link"> 探索 </router-link>
          <router-link to="/about" class="router-link"> 关于 </router-link>
        </div>
      </div>
      <div class="flex-none gap-2">
        <button class="btn btn-ghost btn-circle" @click.stop="onSearch">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img
                :src="isLogin ? userStore.avatar || avatar : avatarNoLogin"
              />
            </div>
          </label>
          <ul
            tabindex="0"
            class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a class="justify-between">
                个人主页
                <span class="badge">New</span>
              </a>
            </li>
            <li v-if="isLogin" @click.stop="onLogout"><a> 个人登出 </a></li>
            <li v-else @click.stop="onLogin"><a> 个人登录 </a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <Teleport to="body"> -->
    <ModalForm ref="modalRef"></ModalForm>
    <!-- </Teleport> -->
  </div>
</template>

<style scoped>
  .router-link {
    @apply tab text-base font-semibold;
  }
</style>
