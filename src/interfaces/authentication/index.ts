import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AuthenticationInterface {
  id?: string;
  wifi_hotspot: string;
  sms_settings: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface AuthenticationGetQueryInterface extends GetQueryInterface {
  id?: string;
  wifi_hotspot?: string;
  sms_settings?: string;
  user_id?: string;
}
