import { defineStore } from 'pinia';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false
  }),

  actions: {
    async login(email: string, password: string) {
      const { $api } = useNuxtApp();
      
      try {
        const response = await $api.post('/auth/login', { email, password });
        
        if (response.data.success) {
          this.user = response.data.data.user;
          this.accessToken = response.data.data.accessToken;
          this.refreshToken = response.data.data.refreshToken;
          this.isAuthenticated = true;

          // Guardar en localStorage
          if (process.client) {
            localStorage.setItem('accessToken', this.accessToken);
            localStorage.setItem('refreshToken', this.refreshToken);
            localStorage.setItem('user', JSON.stringify(this.user));
          }

          return { success: true, user: this.user };
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al iniciar sesión'
        };
      }
    },

    async register(userData: { email: string; password: string; name: string; phone?: string }) {
      const { $api } = useNuxtApp();
      
      try {
        const response = await $api.post('/auth/register', userData);
        return { success: true, data: response.data };
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al registrar usuario'
        };
      }
    },

    async refreshAccessToken() {
      const { $api } = useNuxtApp();
      
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const response = await $api.post('/auth/refresh', {
          refreshToken: this.refreshToken
        });

        if (response.data.success) {
          this.accessToken = response.data.data.accessToken;
          
          if (process.client) {
            localStorage.setItem('accessToken', this.accessToken);
          }
        }
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    async logout() {
      const { $api } = useNuxtApp();
      
      try {
        if (this.refreshToken) {
          await $api.post('/auth/logout', {
            refreshToken: this.refreshToken
          });
        }
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.isAuthenticated = false;

        if (process.client) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    },

    async fetchProfile() {
      const { $api } = useNuxtApp();
      
      try {
        const response = await $api.get('/auth/profile');
        
        if (response.data.success) {
          this.user = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },

    initializeAuth() {
      if (process.client) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');

        if (accessToken && refreshToken && userStr) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
          this.user = JSON.parse(userStr);
          this.isAuthenticated = true;
        }
      }
    },

    updateUserRole(newRole: string) {
      if (this.user) {
        this.user.role = newRole;
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      }
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isOrganizer: (state) => state.user?.role === 'organizer' || state.user?.role === 'admin',
    userRole: (state) => state.user?.role || 'guest'
  }
});
