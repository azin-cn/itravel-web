<script lang="ts" setup>
  import * as settings from '@/config/settings.json';
</script>

<template>
  <div class="navbar bg-opacity-50 pl-36 pr-36 pt-4 pb-4">
    <div class="flex-1">
      <!-- Title -->
      <router-link to="/" class="btn btn-ghost normal-case text-2xl">
        {{ settings?.title }}
      </router-link>

      <div class="tabs md:space-x-8 md:ml-24">
        <router-link to="/home" class="router-link tab-active">
          Home
        </router-link>
        <router-link to="/about" class="router-link"> About </router-link>
        <router-link to="/explore" class="router-link"> Explore </router-link>
        <router-link to="/contact" class="router-link"> Contact </router-link>
      </div>
    </div>
    <div class="flex-none gap-2">
      <button class="btn btn-ghost btn-circle">
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
            <img src="../../../assets/images/avatar.jpg" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .router-link {
    @apply tab text-base font-semibold;
  }
</style>
