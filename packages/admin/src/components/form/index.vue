<script setup lang="ts">
  import { ref } from 'vue';
  import type { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';

  import type { IField } from './index';

  interface FormProp {
    fields: IField[];
    cols: number;
    autoSubmit?: boolean;
    sumbitType?: 'text' | 'icon';
  }

  const props = withDefaults(defineProps<FormProp>(), {
    fields: () => [],
    autoSubmit: true,
    cols: 1,
    sumbitType: 'text',
  });

  const options = ref<Record<string, any>>({});

  const emits = defineEmits(['change', 'submit']);

  const { loading, setLoading } = useLoading();
  const { loading: searchLoading, setLoading: setSearchLoading } = useLoading();

  const genForm = (reset = false) => {
    return props.fields.reduce((acc, cur) => {
      acc[cur.field] = [];
      if (typeof cur.comp === 'string') {
        if (['select', 'checkbox-group', 'range-picker'].includes(cur.comp)) {
          acc[cur.field] = reset ? [] : cur.defaultValue || [];
        } else {
          acc[cur.field] = reset ? '' : cur.defaultValue || '';
        }
      } else if (typeof cur.defaultValue === 'function') {
        acc[cur.field] = reset ? cur.defaultValue(false) : cur.defaultValue();
      } else {
        acc[cur.field] = reset ? '' : cur.defaultValue;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  const form = ref(genForm());

  const formRef = ref<FormInstance>();

  const formatValue = () => {
    return props.fields.reduce((acc, cur) => {
      const value = form.value[cur.field];
      if (typeof cur.comp === 'string') {
        if (['select', 'checkbox-group'].includes(cur.comp)) {
          if (value && value.length > 0) {
            acc[cur.field] = value.join(',');
          }
        } else if (['range-picker'].includes(cur.comp)) {
          if (value && value?.length > 0) {
            const [after, before] = value;
            acc[`${cur.field}_before`] = before;
            acc[`${cur.field}_after`] = after;
          } else {
            // acc[`${cur.field}_before`] = '';
            // acc[`${cur.field}_after`] = '';
          }
        } else if (value || value === 0) {
          acc[cur.field] = value;
        }
      } else if (cur.handleValue) {
        cur.handleValue(acc, value, cur.field);
      } else if (value || value === 0) {
        acc[cur.field] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  emits('change', formatValue(), form.value);

  const onChange = () => {
    emits('change', formatValue(), form.value);
  };

  const onSubmit = () => {
    emits('submit', formatValue(), form.value);
  };

  const reset = () => {
    form.value = genForm(true);
    emits('change', formatValue(), form.value);
  };

  const setForm = (key: string, value: any) => {
    form.value[key] = value;
  };

  const onSearch = async (value: string, field: IField) => {
    try {
      setSearchLoading(true);
      if (field.request) {
        options.value[field.field] = await field.request(value);
      }
    } catch (error) {
      //
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchOptions = async () => {
    setLoading(true);
    await Promise.all(
      props.fields
        .filter((el) => el.request)
        .map(async (el) => {
          if (el.request) {
            if (el.search === true && el.initial) {
              el.options = await el.initial();
            } else {
              el.options = await el.request();
            }
            options.value[el.field] = el.options || [];
          }
        })
    );
    setLoading(false);
  };

  fetchOptions();

  defineExpose({
    setForm,
    onSubmit,
    reset,
  });
</script>

<template>
  <a-spin
    :loading="loading"
    :tip="$t('stories.form.loading')"
    :style="{ display: 'block' }"
  >
    <a-row>
      <a-col :flex="1">
        <a-form
          ref="formRef"
          size="large"
          :label-col-props="
            props.sumbitType === 'text'
              ? { span: 5, offset: 0 }
              : { span: 7, offset: 0 }
          "
          :wrapper-col-props="
            props.sumbitType === 'text'
              ? { span: 19, offset: 0 }
              : { span: 17, offset: 0 }
          "
          :model="form"
          @submit="onSubmit"
        >
          <a-row :gutter="16">
            <a-col
              v-for="item in props.fields"
              :key="item.field"
              :span="24 / props.cols"
            >
              <a-form-item :field="item.field" :label="$t(item.label)">
                <template v-if="typeof item.comp === 'string'">
                  <template v-if="item.comp === 'input'">
                    <a-input
                      v-model="form[item.field]"
                      allow-clear
                      :placeholder="`${$t('form.input.placeholder')}${$t(
                        item.label
                      )}`"
                      @press-enter="onChange"
                      @clear="onChange"
                    ></a-input>
                  </template>
                  <template v-if="item.comp === 'select'">
                    <a-select
                      v-model="form[item.field]"
                      :options="
                        (item.options || []).length > 0
                          ? item.options
                          : options[item.field]
                      "
                      :placeholder="`${$t('form.select.placeholder')}${$t(
                        item.label
                      )}`"
                      :disabled="item.disabled || false"
                      multiple
                      allow-clear
                      allow-search
                      @change="onChange"
                    >
                    </a-select>
                  </template>
                  <template v-if="item.comp === 'single-select'">
                    <a-select
                      v-model="form[item.field]"
                      :options="
                        (item.options || []).length > 0
                          ? item.options
                          : options[item.field]
                      "
                      :placeholder="`${$t(
                        item.search === true
                          ? 'form.select.search.placeholder'
                          : 'form.select.placeholder'
                      )}${$t(item.label)}`"
                      allow-clear
                      allow-search
                      :loading="item.search === true ? searchLoading : false"
                      :filter-option="item.search === true ? false : true"
                      :show-extra-options="item.search === true ? false : true"
                      @change="onChange"
                      @search="onSearch($event, item)"
                    >
                    </a-select>
                  </template>
                  <template v-if="item.comp === 'checkbox-group'">
                    <a-checkbox-group
                      v-model="form[item.field]"
                      @change="onChange"
                    >
                      <a-checkbox
                        v-for="el in item.options || []"
                        :key="el.value"
                        :value="el.value"
                        >{{ el.label }}</a-checkbox
                      >
                    </a-checkbox-group>
                  </template>
                  <template v-if="item.comp === 'radio-group'">
                    <a-radio-group
                      v-model="form[item.field]"
                      @change="onChange"
                    >
                      <a-radio
                        v-for="el in item.options || []"
                        :key="el.label"
                        :value="el.value"
                      >
                        {{ el.label }}
                      </a-radio>
                    </a-radio-group>
                  </template>
                  <template v-if="item.comp === 'range-picker'">
                    <a-range-picker
                      v-model="form[item.field]"
                      @change="onChange"
                      @clear="onChange"
                    />
                  </template>
                </template>
                <component
                  :is="item.comp"
                  v-else
                  v-model="form[item.field]"
                  :options="
                    (item.options || []).length > 0
                      ? item.options
                      : options[item.field]
                  "
                  :config="item.config"
                  @change="onChange"
                ></component>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item v-if="!props.autoSubmit">
            <a-space>
              <a-button size="medium" @click="formRef?.resetFields()">{{
                $t('form.actions.reset')
              }}</a-button>
              <a-button size="medium" type="primary" html-type="submit">{{
                $t('form.actions.filter')
              }}</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-col>
      <a-divider
        v-if="props.autoSubmit"
        style="height: 84px"
        direction="vertical"
      />
      <a-col
        v-if="props.autoSubmit"
        :flex="props.sumbitType === 'text' ? '86px' : '30px'"
        style="text-align: right"
      >
        <a-space
          v-if="props.sumbitType === 'text'"
          direction="vertical"
          :size="12"
        >
          <a-button type="primary" @click="onSubmit">
            <template #icon>
              <icon-search />
            </template>
            {{ $t('searchTable.form.search') }}
          </a-button>
          <a-button @click="reset">
            <template #icon>
              <icon-refresh />
            </template>
            {{ $t('searchTable.form.reset') }}
          </a-button>
        </a-space>
        <a-space v-else direction="vertical" :size="12">
          <a-tooltip :content="$t('searchTable.form.search')">
            <a-button type="primary" @click="onSubmit">
              <template #icon>
                <icon-search />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip :content="$t('searchTable.form.reset')">
            <a-button @click="formRef?.resetFields()">
              <template #icon> <icon-refresh /> </template
            ></a-button>
          </a-tooltip>
        </a-space>
      </a-col>
    </a-row>

    <!-- <a-form-item field="size" label="Form Size">
      <a-radio-group v-model="form.size" type="button">
        <a-radio value="mini">Mini</a-radio>
        <a-radio value="small">Small</a-radio>
        <a-radio value="medium">Medium</a-radio>
        <a-radio value="large">Large</a-radio>
      </a-radio-group>
    </a-form-item> -->
    <!-- <a-form-item
      field="name"
      label="Username"
      :rules="[
        { required: true, message: 'name is required' },
        { minLength: 5, message: 'must be greater than 5 characters' },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <a-input
        v-model="form.name"
        placeholder="please enter your username..."
      />
    </a-form-item> -->
    <!-- <a-form-item
      field="age"
      label="Age"
      :rules="[
        { required: true, message: 'age is required' },
        { type: 'number', max: 200, message: 'age is max than 200' },
      ]"
    >
      <a-input-number
        v-model="form.age"
        placeholder="please enter your age..."
      />
    </a-form-item> -->
    <!-- <a-form-item
      field="section"
      label="Section"
      :rules="[{ match: /section one/, message: 'must select one' }]"
    >
      <a-select v-model="form.section" placeholder="Please select ...">
        <a-option value="section one">Section One</a-option>
        <a-option value="section two">Section Two</a-option>
        <a-option value="section three">Section Three</a-option>
      </a-select>
    </a-form-item> -->
    <!-- <a-form-item
      field="province"
      label="Province"
      :rules="[{ required: true, message: 'province is required' }]"
    >
      <a-cascader
        v-model="form.province"
        :options="options"
        placeholder="Please select ..."
        allow-clear
      />
    </a-form-item> -->
    <!-- <a-form-item
      field="options"
      label="Options"
      :rules="[
        {
          type: 'array',
          minLength: 2,
          message: 'must select greater than two options',
        },
      ]"
    >
      <a-checkbox-group v-model="form.options">
        <a-checkbox value="option one">Section One</a-checkbox>
        <a-checkbox value="option two">Option Two</a-checkbox>
        <a-checkbox value="option three">Option Three</a-checkbox>
        <a-checkbox value="option four">Option Four</a-checkbox>
      </a-checkbox-group>
    </a-form-item> -->
    <!-- <a-form-item field="date" label="Date">
      <a-date-picker v-model="form.date" placeholder="Please select ..." />
    </a-form-item>
    <a-form-item field="time" label="Time">
      <a-time-picker v-model="form.time" placeholder="Please select ..." />
    </a-form-item> -->
    <!-- <a-form-item
      field="radio"
      label="Radio"
      :rules="[{ match: /one/, message: 'must select one' }]"
    >
      <a-radio-group v-model="form.radio">
        <a-radio value="radio one">Radio One</a-radio>
        <a-radio value="radio two">Radio Two</a-radio>
      </a-radio-group>
    </a-form-item> -->
    <!-- <a-form-item
      field="slider"
      label="Slider"
      :rules="[{ type: 'number', min: 5, message: 'slider is min than 5' }]"
    >
      <a-slider v-model="form.slider" :max="10" />
    </a-form-item> -->
    <!-- <a-form-item field="score" label="Score">
      <a-rate v-model="form.score" allow-clear />
    </a-form-item> -->
    <!-- <a-form-item
      field="switch"
      label="Switch"
      :rules="[{ type: 'boolean', true: true, message: 'must be true' }]"
    >
      <a-switch v-model="form.switch" />
    </a-form-item> -->
    <!-- <a-form-item field="multiSelect" label="Multiple Select">
      <a-select
        v-model="form.multiSelect"
        placeholder="Please select ..."
        multiple
      >
        <a-option value="section one">Section One</a-option>
        <a-option value="section two">Section Two</a-option>
        <a-option value="section three">Section Three</a-option>
      </a-select>
    </a-form-item> -->
    <!-- <a-form-item field="treeSelect" label="Tree Select">
      <a-tree-select
        v-model="form.treeSelect"
        :data="treeData"
        placeholder="Please select ..."
      />
    </a-form-item> -->
    <!-- <a-form-item>
      <a-space>
        <a-button html-type="submit">Submit</a-button>
        <a-button @click="$refs.formRef.resetFields()">Reset</a-button>
      </a-space>
    </a-form-item> -->
  </a-spin>
</template>
