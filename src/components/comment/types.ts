export interface IRecord {
  user: string;
  toUser: string;
  parent: string | null;
  content: string;
  comment: string;
}

export interface IAction {
  key: 'reply' | 'thumb-up' | 'delete';
  record: Partial<IRecord>;
}
