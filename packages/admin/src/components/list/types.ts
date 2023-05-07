import type { Component } from 'vue';
import type { ButtonProps } from '@arco-design/web-vue/es/button';

export interface IColumn {
  title: string;
  prop: string;
  width?: number;
  menus?: IColumn[];
  ellipsis?: boolean;
  tooltip?: boolean;
  formatter?: (raw: any, rowIndex: number, record: any) => unknown;
  sortable?: boolean;
  defaultSortOrder?: 'descend' | 'ascend' | '';
  filterable?: boolean;
  filters?: { text: string; value: number | string }[];
}

export interface IOption {
  label: string;
  value: number | string;
}
export interface ActionButton {
  key: string;
  type?: ButtonProps['type'];
  status?: ButtonProps['status'];
  text?: string;
  icon?: Component;
  cls?: string; // class
  comp?: 'button' | string;
  actions?: ActionButton[];
  confirm?: boolean;
  confirmText?: string;
  confirmMsg?: (record: any) => Record<string, string>;
  trigger?: boolean;
  triggerContent?: Component;
  bulk?: boolean;
  group?: boolean;
  hidden?: boolean | ((record: any) => boolean);
  permission?: number | number[];
}

export type IAction = ActionButton;

export const isButtonAction = (action: IAction): action is ActionButton =>
  action?.comp === undefined || action?.comp === 'button';

export interface IActionRecord {
  action: IAction;
  record: unknown;
  selectedKeys: Array<string | number>;
  records: unknown;
}
