import { defineStore } from 'pinia';

interface League {
  id: number;
  name: string;
  description: string;
  sport_id: number;
  sport_name: string;
  organizer_id: number;
  organizer_name: string;
  location: string;
  status: string;
  logo?: string;
  created_at: string;
}

interface LeagueState {
  leagues: League[];
  currentLeague: League | null;
  loading: boolean;
  error: string | null;
}

export const useLeagueStore = defineStore('league', {
  state: (): LeagueState => ({
    leagues: [],
    currentLeague: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchLeagues(filters?: { status?: string; sport_id?: number }) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.get('/leagues', { params: filters });
        
        if (response.data.success) {
          this.leagues = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar ligas';
      } finally {
        this.loading = false;
      }
    },

    async fetchLeagueById(id: number) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.get(`/leagues/${id}`);
        
        if (response.data.success) {
          this.currentLeague = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar liga';
      } finally {
        this.loading = false;
      }
    },

    async createLeague(leagueData: any) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.post('/leagues', leagueData);
        
        if (response.data.success) {
          await this.fetchLeagues();
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear liga';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateLeague(id: number, leagueData: any) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.put(`/leagues/${id}`, leagueData);
        
        if (response.data.success) {
          await this.fetchLeagues();
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar liga';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteLeague(id: number) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.delete(`/leagues/${id}`);
        
        if (response.data.success) {
          await this.fetchLeagues();
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al eliminar liga';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});
