import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import client from '@/app/api/client';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials) => {
    
    const response = await client.post('/login', credentials);
    const { token: apiToken, user: userData } = response.data;

    token.value = apiToken;
    user.value = userData;

    localStorage.setItem('token', apiToken);
    localStorage.setItem('user', JSON.stringify(userData));

    return response.data;
  };

  const logout = async () => {
    try {
      if (token.value) {
        await client.post('/logout');
      }
    } catch (e) {
      console.warn('Logout error di backend:', e);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
});