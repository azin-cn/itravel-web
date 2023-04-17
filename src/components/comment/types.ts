export interface IAction {
  key: 'reply' | 'thumb-up' | 'delete';
  record: {
    userId: string;
    toUserId: string;
    content?: string;
  };
}
