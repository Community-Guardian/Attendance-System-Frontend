export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'lecturer' | 'hod' | 'dp_academics' | 'config_user' | 'admin';
  department: string | null;
  mac_address: string | null;
  borrow_account_enabled: boolean;
  registered_face: string | null;
}