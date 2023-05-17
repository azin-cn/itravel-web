<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { IAction, IActionRecord, IColumn } from '@/components/list/types';
  import List from '@/components/list/index.vue';
  import Clamp from '@/components/clamp/index.vue';
  import Form from '@/components/form/index.vue';
  import { IField } from '@/components/form';
  import {
    IconArrowDown,
    IconArrowUp,
    IconDelete,
    IconEye,
    IconMore,
    IconPlus,
  } from '@arco-design/web-vue/es/icon';
  import {
    IQueryParams,
    AdminSpotModel,
    ArticleBriefInfo,
    getSpotsByConditions,
    getArticlesByConditions,
    patchArticleStatus,
    ARTICLE_STATUS,
    STATUS,
  } from '@/api/list';
  import { Message } from '@arco-design/web-vue';

  const router = useRouter();
  const { query, path } = router.currentRoute.value;

  const listRef = ref<InstanceType<typeof List>>();
  const listParams = ref<Record<string, any>>({});
  const formParams = ref<Record<string, any>>({});

  const fields = computed<IField[]>(() => [
    {
      field: 'id',
      label: '文章ID',
      defaultValue: query.id || '',
      comp: 'input',
      options: [],
    },
    {
      field: 'keywords',
      label: '文章关键字',
      defaultValue: query.name || '',
      comp: 'input',
      options: [],
    },
    {
      field: 'username',
      label: '作者',
      defaultValue: query.region || '',
      comp: 'input',
      options: [],
    },
    {
      field: 'spot',
      label: '景点关键字',
      defaultValue: query.region || '',
      comp: 'input',
      options: [],
    },
    {
      field: 'create_date',
      label: '创建时间',
      comp: 'range-picker',
      options: [],
    },
    {
      field: 'update_date',
      label: '更新时间',
      comp: 'range-picker',
      options: [],
    },
  ]);
  const columns: IColumn[] = [
    {
      title: 'ID',
      prop: 'id',
      width: 80,
    },
    {
      title: '文章标题',
      prop: 'title',
      width: 180,
    },
    {
      title: '文章简介',
      prop: 'description',
      width: 80,
      formatter: (raw: string) => raw || '-',
    },
    {
      title: '状态',
      prop: 'status',
      width: 120,
      formatter: (raw: 0 | 1) => ARTICLE_STATUS[raw].label,
    },
    {
      title: '作者',
      prop: 'author',
      width: 120,
      formatter: (raw: ArticleBriefInfo['author']) => raw.username || '-',
    },
    {
      title: '关联景点',
      prop: 'spot',
      width: 120,
      formatter: (raw: ArticleBriefInfo['spot']) => raw.name || '-',
    },
    {
      title: '分类',
      prop: 'category',
      width: 120,
      formatter: (raw: ArticleBriefInfo['category']) => raw?.name || '-',
    },
    {
      title: '标签',
      prop: 'tags',
      width: 120,
      formatter: (raw: ArticleBriefInfo['tags']) => raw.join(',') || '-',
    },
    {
      title: '收藏量',
      prop: 'favCount',
      width: 120,
    },
    {
      title: '阅读量',
      prop: 'viewCount',
      width: 120,
    },
    {
      title: '点赞量',
      prop: 'likeCount',
      width: 120,
    },
    {
      title: '缩略图',
      prop: 'thumbUrl',
      width: 180,
    },
    {
      title: '全景图URL',
      prop: 'panorama',
      width: 180,
    },
    {
      title: '创建时间',
      prop: 'createdTime',
      width: 180,
      formatter: (raw, rowIndex, record) => new Date(raw).toLocaleString(),
    },
    {
      title: '更新时间',
      prop: 'updatedTime',
      width: 180,
      formatter: (raw, rowIndex, record) => new Date(raw).toLocaleString(),
    },
  ];
  const actions: IAction[] = [
    {
      key: 'preview',
      icon: IconEye,
    },
    {
      key: 'delete',
      icon: IconDelete,
      confirm: true,
      confirmText: '是否确认删除',
    },
    {
      key: 'more',
      icon: IconMore,
      actions: [
        {
          key: 'online',
          icon: IconArrowUp,
          hidden: (record: ArticleBriefInfo) =>
            record.status === STATUS.PUBLISH,
        },
        {
          key: 'offline',
          icon: IconArrowDown,
          hidden: (record: ArticleBriefInfo) => record.status === STATUS.DRAFT,
        },
      ],
    },
  ];

  const toolbar = computed<IAction[]>(() => [
    {
      key: 'bulk-delete',
      icon: IconDelete,
      type: 'secondary',
      bulk: true,
      confirm: true,
      confirmText: '确认删除已选数据？',
    },
  ]);

  const toggleClamp = computed(() => {
    return !!fields.value
      .filter((el, index) => index > 3)
      .find((el) => el.defaultValue?.length > 0);
  });

  const onFormChange = (params: Record<string, any>) => {
    formParams.value = params;
    listRef.value?.reset();
  };

  const replaceQuery = (q: Record<string, any>) => {
    const urlQuery = Object.entries(q || {})
      .filter(([key, value]) => !!value)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
    window.history.replaceState(
      { replace: true, current: path },
      '',
      `#${router.currentRoute.value.path}${urlQuery ? `?${urlQuery}` : ''}`
    );
  };

  const onAction = async ({ action, selectedKeys, record }: IActionRecord) => {
    const { key } = action;
    const { id } = (record || {}) as AdminSpotModel;
    switch (key) {
      case 'preview':
        window.open(`https://itravel.todayto.com/#/article/${id}`);
        break;
      case 'online':
        await patchArticleStatus(id, STATUS.PUBLISH);
        listRef.value?.reload();
        break;
      case 'offline':
        await patchArticleStatus(id, STATUS.DRAFT);
        listRef.value?.reload();
        break;
      case 'delete':
        Message.success('删除成功(为了数据安全，暂不允许删除)');
        listRef.value?.reload();
        break;
      case 'bulk-delete':
        Message.success('删除成功(为了数据安全，暂不允许删除)');
        listRef.value?.reload();
        break;
      default:
    }
  };

  const onSuccess = () => {
    listRef.value?.reload();
  };

  const request = async (params?: Record<string, any>) => {
    listParams.value = {
      ...(params || {}),
      ...formParams.value,
      offset: undefined,
    };

    if (!query.id) {
      replaceQuery(listParams.value);
    }

    const { data } = await getArticlesByConditions(
      listParams.value as IQueryParams
    );
    return {
      data: data.list,
      total: data.total,
    };
  };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.searchSpot']" />
    <a-card style="margin-bottom: 16px">
      <Clamp :default-value="toggleClamp">
        <Form
          :fields="fields"
          :cols="2"
          @submit="onFormChange"
          @change="onFormChange"
        />
      </Clamp>
    </a-card>

    <List
      ref="listRef"
      storage-key="poc-stories"
      :columns="columns"
      :actions="actions"
      :toolbar="toolbar"
      :request="request"
      @action="onAction"
    >
      <template #region="{ record }: { record: AdminSpotModel }">
        <a-tag>{{ record.province?.name }}</a-tag>
        <a-tag>{{ record.city?.name }}</a-tag>
        <a-tag>{{ record.district?.name }}</a-tag>
      </template>
    </List>
    <SpotUpdateForm ref="spotUpdateRef" @success="onSuccess"></SpotUpdateForm>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
