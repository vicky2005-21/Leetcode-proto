export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
}

export const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'path/to/avatar.png',
  joinedDate: '2024-01-01',
};
