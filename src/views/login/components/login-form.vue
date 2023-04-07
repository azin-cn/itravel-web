<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { LOGIN_TYPE } from '@/api/user';
  import type { LoginData } from '@/api/user';
  import { isMobile } from '@/utils/validate';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: undefined,
    password: undefined,
  });

  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    phone: '',
    captcha: '',
    type: 1,
  });

  const state = reactive({
    captchaTime: 0,
    loginType: 'account',
  });

  const onCaptchaClick = async () => {
    if (!isMobile(userInfo.phone)) {
      Message.error('请输入正确的手机号');
      return;
    }

    state.captchaTime = 60;
    // await getCaptcha(userInfo.phone);
    const timer = setInterval(() => {
      state.captchaTime -= 1;
      if (state.captchaTime === 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

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
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
  const changeLoginType = (type: 1 | 2 | 3) => {
    userInfo.type = type;
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
    <a-form-item class="mb-2"> 登录 Itravel </a-form-item>

    <a-form-item>
      <div class="tabs">
        <a
          class="tab tab-bordered"
          :class="userInfo.type === LOGIN_TYPE.ACCOUNT ? 'tab-active' : ''"
          @click="changeLoginType(1)"
        >
          账号登录
        </a>
        <a
          class="tab tab-bordered"
          :class="userInfo.type === LOGIN_TYPE.MOBILE ? 'tab-active' : ''"
          @click="changeLoginType(2)"
        >
          短信登录
        </a>
      </div>
    </a-form-item>
    <!-- 账户登录 -->
    <template v-if="userInfo.type === LOGIN_TYPE.ACCOUNT">
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
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
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
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
    </template>

    <!-- 手机验证码登录 -->
    <div v-if="userInfo.type === LOGIN_TYPE.MOBILE">
      <a-form-item
        field="phone"
        :rules="[{ required: true, message: $t('请输入手机号') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.phone"
          placeholder="请输入手机号"
          allow-clear
        >
          <template #prefix>
            <icon-mobile />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="captcha"
        :rules="[{ required: true, message: '请输入验证码' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.captcha"
          placeholder="请输入验证码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
          <template #append>
            <a-button
              :disabled="state.captchaTime !== 0"
              size="mini"
              long
              @click="onCaptchaClick"
            >
              {{ state.captchaTime !== 0 ? `${state.captchaTime}s` : '' }}
              获取验证码
            </a-button>
          </template>
        </a-input>
      </a-form-item>
    </div>

    <a-space :size="16" class="justify-around">
      <a-checkbox
        v-if="userInfo.type === LOGIN_TYPE.ACCOUNT"
        checked="rememberPassword"
        :model-value="loginConfig.rememberPassword"
        @change="setRememberPassword as any"
      >
        {{ $t('login.form.rememberPassword') }}
      </a-checkbox>

      <a-button type="primary" html-type="submit" long :loading="loading">
        登录
      </a-button>

      <a-button type="text" long class="login-form-register-btn">
        注册
      </a-button>
    </a-space>

    <div class="divider mt-6 mb-6"> OR </div>

    <a-space :size="24" fill align="center" class="justify-center">
      <a-tooltip content="微信" mini>
        <icon-wechat size="18" style="cursor: pointer" />
        <!-- @click="customerLogin('wx')" -->
      </a-tooltip>
      <a-tooltip content="QQ" mini>
        <icon-qq size="18" style="cursor: pointer" />
      </a-tooltip>
      <a-tooltip content="Github" mini>
        <icon-github size="18" style="cursor: pointer" />
      </a-tooltip>
      <a-tooltip content="微博" mini>
        <icon-weibo size="18" style="cursor: pointer" />
      </a-tooltip>
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
  }

  .login-form button {
    position: relative;
    overflow: hidden;
    color: white;
    background-color: rgb(57 88 69 / 40%);
    cursor: pointer;
    transition: 0.4s;
  }

  .login-form button:hover {
    color: white;
    background-color: rgb(12 80 38 / 67%);
  }

  :deep(.arco-checkbox:hover .arco-checkbox-icon-hover::before) {
    background-color: unset;
  }

  :deep(.arco-checkbox-checked .arco-checkbox-icon) {
    background-color: #327565;
  }

  :deep(.arco-input-wrapper) {
    border: none;
  }

  :deep(
      .arco-input-wrapper:focus-within,
      .arco-input-wrapper.arco-input-focus
    ) {
    border: none;
    border-color: unset;
    outline: none;
    box-shadow: none;
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
