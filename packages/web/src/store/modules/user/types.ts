export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  name?: string;
  job?: string;
  organization?: string;
  location?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;

  // itravel
  id?: string;
  username?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  description?: string;
  title?: string;
  visitors?: number;
  createdTime?: string;
  updatedTime?: string;
  thumbUrl?: string;
}
