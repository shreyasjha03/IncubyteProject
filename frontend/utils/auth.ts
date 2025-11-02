import Cookies from 'js-cookie';

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get('token') || null;
  }
  return null;
};

export const setToken = (token: string): void => {
  Cookies.set('token', token, { expires: 7 });
};

export const removeToken = (): void => {
  Cookies.remove('token');
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const setUser = (user: any): void => {
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const removeUser = (): void => {
  Cookies.remove('user');
};

export const logout = (): void => {
  removeToken();
  removeUser();
};

