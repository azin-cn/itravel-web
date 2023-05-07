<script lang="tsx" setup>
  import { ref, reactive, computed } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import {
    // IconList,
    // IconApps,
    IconRefresh,
    IconSettings,
    IconMore,
    IconDown,
  } from '@arco-design/web-vue/es/icon';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { useCounter, useStorage } from '@vueuse/core';
  import type {
    TableInstance,
    TableData,
    TableRowSelection,
    TableExpandable,
    TableColumnData,
  } from '@arco-design/web-vue/es/table';
  import { Pagination } from '@/types/global';
  import { IAction, IActionRecord, IColumn, isButtonAction } from './types';

  export interface ListProp {
    request: (
      params?: Record<string, any>
    ) => Promise<{ data: any[]; total: number }>;
    beforeRequest?: () => Promise<void>;
    columns: IColumn[];
    toolbar: IAction[];
    actions: IAction[];
    scroll?: {
      x?: number | string;
      y?: number | string;
      minWidth?: number | string;
      maxHeight?: number | string;
    };
    pagination?: Partial<Pagination>;
    storageKey?: string;
    rowKey?: string;
    title?: string;
    rowSelection?: TableRowSelection | boolean;
    expandable?: TableExpandable;
  }

  const { t } = useI18n();
  const { count, inc } = useCounter(0);
  const userStore = useUserStore();

  const defaultRowSelection: TableRowSelection = {
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [],
    onlyCurrent: true,
  };

  const defaultStorageKey = '__storage_key';

  const props = withDefaults(defineProps<ListProp>(), {
    request: async () => ({ data: [], total: 0 }),
    columns: () => [],
    toolbar: () => [],
    actions: () => [],
    pagination: () => ({}),
    rowKey: 'id',
    rowSelection: true,
    storageKey: '__storage_key',
  });

  const tableRef = ref<TableInstance>();

  const checkPermission = (permission?: number | number[]) => {
    return (
      !permission ||
      (Array.isArray(permission) ? permission : [permission]).some((el) =>
        userStore.permissions.includes(el)
      )
    );
  };

  const filteredToolbar = computed(() => {
    return props.toolbar.filter((el) => {
      if (el.actions) {
        el.actions = el.actions.filter((e) => checkPermission(e.permission));
      }
      return (
        checkPermission(el.permission) &&
        (!el.actions || (el.actions && el.actions.length > 0))
      );
    });
  });

  const filteredActions = computed(() => {
    return props.actions.filter((el) => {
      if (el.actions) {
        el.actions = el.actions.filter((e) => checkPermission(e.permission));
      }
      return (
        checkPermission(el.permission) &&
        (!el.actions || (el.actions && el.actions.length > 0))
      );
    });
  });

  const rowSelection = computed<TableRowSelection | undefined>(() => {
    if (typeof props.rowSelection === 'boolean') {
      if (props.rowSelection) {
        return defaultRowSelection;
      }
      return undefined;
    }
    return props.rowSelection;
  });

  const emits = defineEmits([
    'action',
    'cellClick',
    'selectionChange',
    'reload',
  ]);

  const { loading, setLoading } = useLoading(false);

  const renderData = ref<any[]>([]);

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
    total: 0,
    showTotal: true,
    showPageSize: true,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100, 200, 500],
  };

  const pagination = reactive({
    ...basePagination,
    ...props.pagination,
  });

  const selectedKeys = ref<(string | number)[]>([]);

  const colKeys = props.columns.map((el) => el.prop);
  const STORAGE_KEY = 'list-config';

  const checkedColKeys =
    props.storageKey !== defaultStorageKey
      ? useStorage(STORAGE_KEY, { [props.storageKey]: colKeys }, localStorage, {
          mergeDefaults: true,
        })
      : ref({ [props.storageKey]: colKeys });

  const renderedCols = computed(() => {
    return props.columns.filter((el) =>
      checkedColKeys.value[props.storageKey].includes(el.prop)
    );
  });

  const queryForm = reactive<{
    sort: Record<string, string>;
    filter: Record<string, string>;
  }>({ sort: {}, filter: {} });

  const oprationsColumnWidth = computed(() => {
    return Math.max(filteredActions.value.length * 50, 80);
  });

  const records = computed(() => {
    if (selectedKeys.value.length === 0) return [];
    return renderData.value.filter((item) =>
      selectedKeys.value.includes(item[props.rowKey])
    );
  });

  const handleQueryForm = () => {
    props.columns.forEach((item) => {
      if (item.sortable && item.defaultSortOrder) {
        queryForm.sort[item.prop] = item.defaultSortOrder;
      }
    });
  };

  const handleSortQuery = () => {
    const sortQuery = Object.keys(queryForm.sort)
      .map((item) => {
        if (queryForm.sort[item]) {
          return `${queryForm.sort[item] === 'descend' ? '-' : ''}${item}`;
        }
        return undefined;
      })
      .filter((item) => !!item)
      .join();

    return { ordering: sortQuery };
  };

  const refreshRenderData = (cnt: number, results: any) => {
    if (cnt !== count.value) return;
    renderData.value = results.data;
    pagination.total = results.total;
    emits('reload');
  };

  const reload = async (config?: { loading?: boolean }) => {
    const { current, pageSize } = pagination;

    const params = {
      ...handleSortQuery(),
      ...queryForm.filter,
      page: (current - 1) * pageSize,
      limit: pageSize,
    };
    try {
      setLoading(config?.loading || true);
      inc();
      refreshRenderData(count.value, await props.request(params));
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    pagination.current = 1;
    reload();
  };

  const onCellClick = (
    record: TableData,
    column: TableColumnData,
    evt: Event
  ) => {
    emits('cellClick', record, column, evt);
  };

  const onSelectionChange = (rowKeys: (string | number)[]) => {
    emits('selectionChange', rowKeys);
  };

  const setSelectedKeys = (keys: (number | string)[]) => {
    selectedKeys.value = keys;
  };

  const onSortChange = (dataIndex: string, direction: string) => {
    queryForm.sort = {
      [dataIndex]: direction,
    };
    reload();
  };

  const onPageChange = (page: number) => {
    pagination.current = page;
    reload();
  };

  const onPageSizeChange = (pageSize: number) => {
    pagination.current = 1;
    pagination.pageSize = pageSize;
    reload();
  };

  const onAction = async ({
    action,
    record,
  }: {
    action: IAction;
    record: any;
  }) => {
    if (isButtonAction(action)) {
      if (action.bulk && !selectedKeys.value.length) {
        Message.warning(t('list.actions.records.errMsg'));
        return;
      }

      if (action.confirm && action.confirmText) {
        Modal.confirm({
          title: t('list.actions.confirm.info'),
          content: t(
            action.confirmText || '',
            action.confirmMsg ? action.confirmMsg(record) : {}
          ),
          okText: t('list.actions.confirm.okText'),
          cancelText: t('list.actions.confirm.cancelText'),
          onOk: () => {
            emits('action', {
              action,
              record,
              selectedKeys: selectedKeys.value,
              records: records.value,
            } as IActionRecord);
          },
        });
      } else {
        emits('action', {
          action,
          record,
          selectedKeys: selectedKeys.value,
          records: records.value,
        } as IActionRecord);
      }
    } else {
      emits('action', {
        action,
        record,
        selectedKeys: selectedKeys.value,
        records: records.value,
      } as IActionRecord);
    }
  };

  const init = async () => {
    if (props.beforeRequest) {
      await props.beforeRequest();
    }
    handleQueryForm();
    reload();
  };

  init();

  defineExpose({
    setSelectedKeys,
    reload,
    reset,
  });
</script>

<template>
  <a-card class="list-page" :bordered="false">
    <template v-if="props.title" #title>
      {{ props.title }}
    </template>
    <slot name="table-header"></slot>
    <a-row style="margin-bottom: 16px">
      <a-col :span="16">
        <slot name="actions-left"></slot>
        <a-space>
          <template v-for="action in filteredToolbar" :key="action.key">
            <a-button-group v-if="!action.actions && !action.trigger">
              <a-button
                :type="action.type || 'primary'"
                :status="action.status || 'normal'"
                :class="[action.cls || '']"
                @click="onAction({ action, record: null })"
              >
                <template #icon>
                  <component :is="action.icon" />
                </template>
                {{ $t(`list.toolbar.${action.key}`) }}</a-button
              >
            </a-button-group>
            <a-trigger trigger="click" :unmount-on-close="true">
              <a-button
                v-if="!action.actions && action.trigger"
                :type="action.type || 'primary'"
                :status="action.status || 'normal'"
              >
                <template #icon>
                  <component :is="action.icon" />
                </template>
                {{ $t(`list.toolbar.${action.key}`) }}
              </a-button>
              <template #content>
                <div class="list-toolbar-trigger__content">
                  <component :is="action.triggerContent" />
                </div>
              </template>
            </a-trigger>
            <a-button-group v-if="action.group && action.actions">
              <a-button
                :type="action.type || 'primary'"
                :status="action.status || 'normal'"
                @click="onAction({ action, record: null })"
              >
                <template #icon>
                  <component :is="action.icon" />
                </template>
                {{ $t(`list.toolbar.${action.key}`) }}</a-button
              >
              <a-trigger trigger="click">
                <a-button
                  :type="action.type || 'primary'"
                  :status="action.status || 'normal'"
                >
                  <template #icon>
                    <icon-more />
                  </template>
                </a-button>
                <template #content>
                  <div class="list-toolbar-trigger__content">
                    <a-doption
                      v-for="item in action.actions"
                      :key="item.key"
                      @click="onAction({ action: item, record: null })"
                    >
                      <template #icon>
                        <component :is="item.icon" />
                      </template>
                      {{ $t(`list.toolbar.${item.key}`) }}</a-doption
                    ></div
                  >
                </template>
              </a-trigger>
            </a-button-group>
            <a-dropdown-button v-if="action.actions && !action.group">
              <component :is="action.icon" />
              {{ $t(`list.toolbar.${action.key}`) }}
              <template #icon>
                <icon-down />
              </template>
              <template #content>
                <a-doption
                  v-for="item in action.actions"
                  :key="item.key"
                  @click="onAction({ action: item, record: null })"
                >
                  <template #icon>
                    <component :is="item.icon" />
                  </template>
                  {{ $t(`list.toolbar.${item.key}`) }}</a-doption
                >
              </template>
            </a-dropdown-button>
          </template>
        </a-space>
      </a-col>
      <a-col :span="8" style="text-align: right">
        <a-space>
          <a-input-group>
            <a-button-group type="secondary">
              <a-button @click="() => reload()">
                <template #icon>
                  <IconRefresh />
                </template>
              </a-button>
              <a-trigger
                trigger="click"
                position="bl"
                :unmount-on-close="false"
              >
                <a-button>
                  <template #icon>
                    <IconSettings />
                  </template>
                </a-button>
                <template #content>
                  <div class="list-toolbar-trigger__content columns-check">
                    <a-checkbox-group
                      v-model="checkedColKeys[props.storageKey]"
                      direction="vertical"
                    >
                      <a-checkbox
                        v-for="col in props.columns"
                        :key="col.prop"
                        :value="col.prop"
                        >{{ $t(col.title) }}</a-checkbox
                      >
                    </a-checkbox-group>
                  </div>
                </template>
              </a-trigger>
            </a-button-group>
          </a-input-group>
        </a-space>
      </a-col>
    </a-row>
    <a-table
      ref="tableRef"
      v-model:selectedKeys="selectedKeys"
      v-model:pagination="pagination"
      :row-key="props.rowKey"
      :loading="loading"
      :data="renderData"
      :row-selection="rowSelection"
      :expandable="expandable"
      :scroll="props.scroll"
      width="100%"
      page-position="bottom"
      :bordered="false"
      column-resizable
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @sorter-change="onSortChange"
      @selection-change="onSelectionChange"
      @cell-click="onCellClick"
    >
      <template #columns>
        <a-table-column
          v-for="col in renderedCols"
          :key="col.prop"
          :title="$t(col.title)"
          :data-index="col.prop"
          :sortable="{
            sorter: true,
            sortDirections: col.sortable === true ? ['ascend', 'descend'] : [],
            defaultSortOrder: col.defaultSortOrder || '',
          }"
          :width="col.width"
          :ellipsis="col.ellipsis === false ? false : true"
          :tooltip="col.tooltip === false ? false : true"
        >
          <template #cell="{ record, rowIndex }">
            <slot :name="col.prop" :record="record">
              {{
                col.formatter
                  ? typeof col.formatter === 'function'
                    ? col.formatter(record[col.prop], rowIndex, record)
                    : col.formatter
                  : record[col.prop]
              }}
            </slot>
          </template>
        </a-table-column>
        <a-table-column
          v-if="filteredActions.length"
          :title="$t('list.columns.operations')"
          data-index="operations"
          fixed="right"
          align="right"
          :width="oprationsColumnWidth"
        >
          <template #cell="{ record }">
            <a-space>
              <template
                v-for="action in filteredActions
                  .filter(isButtonAction)
                  .filter(
                    (item) =>
                      !(typeof item.hidden === 'function'
                        ? item.hidden(record)
                        : item.hidden)
                  )"
                :key="action.key"
              >
                <a-tooltip
                  :content="$t(`list.columns.operations.${action.key}`)"
                >
                  <a-button
                    v-if="!action.actions"
                    type="text"
                    size="large"
                    :status="action.status || 'normal'"
                    :style="{ fontSize: '18px' }"
                    @click="onAction({ action, record })"
                  >
                    <template #icon>
                      <component :is="action.icon" />
                    </template>
                  </a-button>
                </a-tooltip>
                <a-dropdown v-if="action.actions" trigger="hover">
                  <a-tooltip
                    :content="$t(`list.columns.operations.${action.key}`)"
                  >
                    <a-button type="text" size="medium" status="normal">
                      <template #icon>
                        <component :is="action.icon" />
                      </template>
                    </a-button>
                  </a-tooltip>
                  <template #content>
                    <a-doption
                      v-for="item in action.actions.filter(
                        (el) =>
                          !(typeof el.hidden === 'function'
                            ? el.hidden(record)
                            : el.hidden)
                      )"
                      :key="item.key"
                      @click="onAction({ action: item, record })"
                    >
                      <template #icon>
                        <component :is="item.icon" />
                      </template>
                      {{ $t(`list.columns.operations.${item.key}`) }}</a-doption
                    >
                  </template>
                </a-dropdown>
              </template>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
</template>

<style lang="less">
  .list-page {
    .arco-table-column-handle {
      top: 10px;
      height: 22px;
      width: 2px;
      background-color: var(--color-secondary-hover);
      &:hover,
      &:active {
        background-color: rgb(var(--primary-6));
      }
    }
  }
  .list-toolbar-trigger__content {
    padding: 10px;
    max-width: 600px;
    background-color: var(--color-bg-popup);
    border-radius: 4px;
    box-shadow: 0 2px 8px #00000026;
    &.columns-check {
      min-width: 120px;
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
