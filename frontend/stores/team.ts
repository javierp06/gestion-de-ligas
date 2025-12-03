import { defineStore } from 'pinia';

interface Team {
  id: number;
  name: string;
  short_name?: string;
  logo?: string;
  captain_id?: number;
  captain_name?: string;
  league_id: number;
  league_name: string;
  sport_name: string;
  founded_date?: string;
  colors?: string;
  stadium?: string;
  created_at: string;
  // Aggregated stats from backend
  total_played?: number;
  total_won?: number;
  total_points?: number;
  // Stats are often calculated on the fly or joined, adding optional here
  stats?: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goals_for: number;
    goals_against: number;
    points: number;
  };
}

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
}

export const useTeamStore = defineStore('team', {
  state: (): TeamState => ({
    teams: [],
    currentTeam: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchTeams(filters?: { league_id?: number }) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.get('/teams', { params: filters });
        
        if (response.data.success) {
          this.teams = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar equipos';
      } finally {
        this.loading = false;
      }
    },

    async fetchTeamById(id: number) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.get(`/teams/${id}`);
        
        if (response.data.success) {
          this.currentTeam = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar equipo';
      } finally {
        this.loading = false;
      }
    },

    async createTeam(teamData: any) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.post('/teams', teamData);
        
        if (response.data.success) {
          await this.fetchTeams();
          return { success: true, message: response.data.message };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear equipo';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateTeam(id: number, teamData: any) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.put(`/teams/${id}`, teamData);
        
        if (response.data.success) {
          await this.fetchTeams();
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar equipo';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteTeam(id: number) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.delete(`/teams/${id}`);
        
        if (response.data.success) {
          await this.fetchTeams();
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al eliminar equipo';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});
