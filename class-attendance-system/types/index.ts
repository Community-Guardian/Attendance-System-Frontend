export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'lecturer' | 'hod' | 'dp_academics' | 'config_user' | 'admin';
  department: string | null;
  mac_address: string | null;
  borrow_account_enabled: boolean;
  registered_face: string | null;
  full_name: string;
  created_at: string;
  updated_at: string;
  last_modified_by: string | null;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  first_name: string;
  last_name: string;
}