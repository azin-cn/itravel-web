<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { AUTH_TYPE } from '@/api/user';
  import type { AuthData } from '@/api/user';
  import { isEmail } from '@/utils/validate';
  import { replaceLogin, redirectLogin } from '@/router/utils';

  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const userInfo = reactive<Partial<AuthData>>({
    username: '',
    email: '',
    password: '',
    type: AUTH_TYPE.ACCOUNT,
  });

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        Message.info('开始注册');
        await userStore.login(values as AuthData);
        replaceLogin();
        Message.success('注册成功，请前往邮箱激活账户');
      } catch (err) {
        Message.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };
</script>

<template>
  <a-form
    ref="loginForm"
    :model="userInfo"
    class="login-form"
    layout="vertical"
    @submit="handleSubmit"
  >
    <a-form-item class="mb-2">
      <a-tooltip content="登录页">
        <a-button size="mini" class="mr-2" @click.stop="replaceLogin">
          <template #icon>
            <IconFont type="icon-arrow_left_fat"></IconFont>
          </template>
        </a-button>
      </a-tooltip>
      注册 Itravel
    </a-form-item>

    <a-form-item
      field="username"
      :rules="[{ required: true, message: '请输入用户名' }]"
      :validate-trigger="['change', 'blur']"
      hide-label
    >
      <a-input
        v-model="userInfo.username"
        placeholder="请输入用户名"
        allow-clear
      >
        <template #prefix>
          <icon-user />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      field="email"
      :rules="[{ required: true, message: '请输入邮箱' }]"
      :validate-trigger="['change', 'blur']"
      hide-label
    >
      <a-input v-model="userInfo.email" placeholder="请输入邮箱" allow-clear>
        <template #prefix>
          <icon-email />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      field="password"
      :rules="[{ required: true, message: '请输入密码' }]"
      :validate-trigger="['change', 'blur']"
      hide-label
    >
      <a-input-password
        v-model="userInfo.password"
        placeholder="请输入密码"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>

    <a-space :size="16" class="justify-around">
      <a-button
        type="text"
        html-type="submit"
        long
        fill
        class="login-form-register-btn"
      >
        点我注册
      </a-button>
    </a-space>
  </a-form>
</template>

<style lang="less" scoped>
  .login-form {
    position: relative;
    z-index: 100;
    // height: 276px;
    display: flex;
    flex-direction: column;
    width: 340px;
    padding: 40px;
    overflow: hidden; /* 隐藏多余的模糊效果 */
    text-align: center;
    background: inherit;
    border-radius: 18px;

    &::before {
      position: absolute;
      top: -10px;
      left: -10px;
      z-index: -1;
      width: calc(100% + 20px);
      height: calc(100% + 20px);
      overflow: hidden;
      background: inherit;
      box-shadow: inset 0 0 0 200px rgb(255 255 255 / 25%);
      filter: blur(6px);
      content: '';
    }

    h2 {
      color: #3d5245;
      font-weight: 400;
      font-size: 18px;
    }
  }

  .login-form input,
  .login-form button {
    padding: 0 14px;
    color: #3d5245;
    background-color: rgb(255 255 255 / 30%);
    border: none;
    border-radius: 4px;
  }

  .login-form input::placeholder {
    color: #3d5245;
    background: none;
  }

  .login-form button {
    position: relative;
    overflow: hidden;
    color: white;
    background-color: rgb(57 88 69 / 40%);
    cursor: pointer;
    transition: 0.4s;

    &:hover {
      color: white;
      background-color: rgb(12 80 38 / 67%);
    }
  }

  :deep(.arco-checkbox:hover .arco-checkbox-icon-hover::before) {
    background-color: unset;
  }

  :deep(.arco-checkbox-checked .arco-checkbox-icon) {
    background-color: #327565;
  }

  :deep(.arco-input-wrapper) {
    border: none;

    &:focus-within,
    &.arco-input-focus {
      border: none;
      outline: none;
      box-shadow: none;
    }

    .arco-input {
      background: none;
    }
  }

  :deep(
      .arco-btn-primary:active,
      .arco-btn-primary[type='button']:active,
      .arco-btn-primary[type='submit']:active
    ) {
    background-color: rgb(57 88 69 / 40%);
  }

  :deep(
      .arco-btn-primary.arco-btn-loading,
      .arco-btn-primary[type='button'].arco-btn-loading,
      .arco-btn-primary[type='submit'].arco-btn-loading
    ) {
    background-color: rgb(57 88 69 / 60%);
    border: none;
  }
</style>
