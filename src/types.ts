export interface VNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  parentId: string | null;
  owner: string;
  permissions: string; // e.g., "rwx------"
  createdAt: string;
  updatedAt: string;
}

export interface VProcess {
  pid: number;
  name: string;
  status: 'running' | 'suspended' | 'sleeping';
  cpu: number;
  memory: number;
  startTime: string;
}

export interface VUser {
  username: string;
  role: 'root' | 'admin' | 'guest';
  lastLogin: string;
}

export interface OSState {
  currentUser: VUser;
  currentDirectory: string; // path
  vfs: VNode[];
  processes: VProcess[];
  booted: boolean;
  language: 'en' | 'sw';
}
