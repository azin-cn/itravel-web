## itravel-web

使用 monorepo 管理项目

- admin
- web

### amin

```sh
cd itravel-web

pnpm admin:dev

pnpm admin:build
```

或者，以下同理

```shell
cd itravel-web/packages/admin

pnpm dev

pnpm build
```

[🚀 查看 AdminReadme](packages/admin/README.md)

### web

```sh
cd itravel-web

pnpm web:dev

pnpm web:build

pnpm web:build:dev
```

[🚀 查看 WebReadme](packages/web/README.md)

### mobile

```shell
cd itravel-web

pnpm mobile:dev

pnpm mobile:build
```

[🚀 查看 MobileReadme](packages/mobile/README.md)

## pnpm monorepo 改造原有项目记录

解决方案

1. 建立 monorepo 项目文件夹
2. pnpm init 初始化项目
3. 建立 packages 文件夹
4. 建立 pnpm-workspace.yaml 文件，写入以下内容

```yml
packages:
  - 'packages/**'
```

5. 建立 .npmrc 文件，写入以下内容

```sh
shamefully-hoist=true
strict-peer-dependencies=false
ignore-workspace-root-check=true
```

6. 将原有项目复制到 packages，删除原有项目的以下内容
   a. .git
   b. .husky
   c. commitlint.config.js
   d. .gitignore

7. 更改原有项目的 package.json，这一部分的功能是将原有的 git 提交策略删除，最后通过配置 monorepo 仓库的提交策略检查代码规范
   a. 重命名项目名称 @itravel/web
   b. 删除 prepare script
   c. 删除 lint-staged script
   d. 删除 lint-staged 字段属性
   e. 删除依赖 `@commitlint/cli`, `@commitlint/config-conventional`, `husky`, `lint-staged`

8. git init monorepo 项目，将原有项目的 .gitignore 文件复制到根目录下

9. (可选择)增加 git 提交策略，commitlint 和 lint-staged
   a. 在 monorepo 项目路径下安装 commitlint 和 lint-staged，-w 表示将依赖写入到根目录的 package.json 中

   ```sh
   pnpm add -D -w @commitlint/cli @commitlint/config-conventional husky lint-staged
   ```

   b. 初始化 husky，出现 .husky 文件夹

   ```shell
   npx husky install
   ```

   c. 更新 monorepo 项目的 package.json

   ```json
   {
     "scripts": {
       "prepare": "husky insall"
     }
   }
   ```

   d. 将 commitlint 集成到 husky，这一部分是检查 commit 规范。配置 commitlint，根目录创建 commitlint-config.ts，写入以下内容

   ```js
   module.exports = {
     extends: ['@commitlint/config-conventional'],
   };
   ```

   e. husky 回调 commitlint

   shell 形式创建

   ```shell
   npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
   ```

   手动在 .husky 文件夹创建 `commit-msg`，写入以下内容

   ```shell
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   npx --no-install commitlint -e $HUSKY_GIT_PARAMS
   ```

   f. 将 lint-staged 集成到 husky，这一部分是检查 git staged 缓存区代码的规范，配置 lint-staged，更新根目录的 package.json ，可根据自己的需求，增加写入以下内容

   ```json
   {
     "scripts": {
       "lint-staged": "npx lint-staged"
     },
     "lint-staged": {
       "*.{js,ts,jsx,tsx}": ["prettier --write", "eslint --fix"],
       "*.vue": ["stylelint --fix", "prettier --write", "eslint --fix"],
       "*.{scss,sass,less,css}": [
         "stylelint --fix --custom-syntax postcss",
         "prettier --write"
       ]
     }
   }
   ```

   g. husky 回调 lint-staged
   shell 形式创建

   ```shell
   npx husky add .husky/pre-commit "npm run lint-staged"
   ```

   手动形式创建，在.husky 文件夹中创建 pre-commit，写入以下内容

   ```shell
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   npm run lint-staged
   ```

10. 更新根目录 package.json，加入快捷启动命令，便能在根目录下直接启动某一个项目，--filter | -F 表示对某一个项目生效

```json
{
  "scripts": {
    "admin:dev": "pnpm --filter @itravel/admin dev",
    "admin:build": "pnpm --filter @itravel/admin build",
    "admin:build:dev": "pnpm --filter @itravel/admin build:dev",
    "web:dev": "pnpm --filter @itravel/web dev",
    "web:build": "pnpm --filter @itravel/web build",
    "web:build:dev": "pnpm --filter @itravel/web build:dev"
  }
}
```

现在一个带有 git 检测的 monorepo 项目就搭建完成了，更多的需求定义可以查看以下文章

- https://juejin.cn/post/7227352009800138789
- https://juejin.cn/post/7071992448511279141
- https://lyh543.github.io/posts/2022-04-18-migrate-npm-multirepo-to-pnpm-monorepo.html

## Nginx 重定向区分 PC 和移动端

根据请求头中的 User-Agent 来确定是否为移动端设备，在 PC 端的 Nginx location 中加入以下以下配置，移动端的 location 暂不加入

```shell
location ^~ / {
    if ($http_user_agent ~* "(iPhone|Android|Windows Phone)") {
        rewrite ^ https://m.itravel.todayto.com$request_uri redirect;
    }
}
```
