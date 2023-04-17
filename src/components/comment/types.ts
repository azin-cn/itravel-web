export interface Action {
  type: string | 'reply' | 'thumb-up' | 'delete';
  record: {
    userId: string;
    toUserId: string;
    content?: string;
  };
}
