import type { Component } from 'vue';

type Value = number | string | number[] | any;
export type ValueType = Value | Record<string, Value> | Value[];

export interface IField {
  field: string;
  label: string;
  comp: string | Component;
  options?: any[];
  disabled?: boolean;
  defaultValue?: ValueType | ((value?: any) => ValueType);
  handleValue?: (
    form: Record<string, any>,
    value: ValueType,
    field: string
  ) => void;
  request?: (params?: any) => Promise<any[]>;
  initial?: (params?: any) => Promise<any[]>;
  search?: boolean; // 远程搜索
  config?: any;
}
