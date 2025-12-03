import { defineStore } from 'pinia';

interface Match {
  id: number;
  tournament_id: number;
  tournament_name: string;
  home_team_id: number;
  home_team_name: string;
  home_team_logo?: string;
  away_team_id: number;
  away_team_name: string;
  away_team_logo?: string;
  match_date: string;
  location: string;
  round: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  home_score?: number;
  away_score?: number;
  referee?: string;
  sport_name?: string;
}

interface MatchState {
  matches: Match[];
  currentMatch: Match | null;
  loading: boolean;
  error: string | null;
}

export const useMatchStore = defineStore('match', {
  state: (): MatchState => ({
    matches: [],
    currentMatch: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchMatches(filters?: { tournament_id?: number; status?: string; date?: string }) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.get('/matches', { params: filters });
        
        if (response.data.success) {
          this.matches = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar partidos';
      } finally {
        this.loading = false;
      }
    },

    async fetchMatchById(id: number) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.get(`/matches/${id}`);
        
        if (response.data.success) {
          this.currentMatch = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar partido';
      } finally {
        this.loading = false;
      }
    },

    async createMatch(matchData: any) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.post('/matches', matchData);
        
        if (response.data.success) {
          await this.fetchMatches();
          return { success: true, message: response.data.message };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear partido';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateMatch(id: number, matchData: any) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.put(`/matches/${id}`, matchData);
        
        if (response.data.success) {
          await this.fetchMatches();
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar partido';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateMatchScore(id: number, scoreData: { home_score: number; away_score: number }) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.put(`/matches/${id}/score`, scoreData);
        
        if (response.data.success) {
          // Update local state immediately for better UX
          const matchIndex = this.matches.findIndex(m => m.id === id);
          if (matchIndex !== -1) {
            this.matches[matchIndex].home_score = scoreData.home_score;
            this.matches[matchIndex].away_score = scoreData.away_score;
            this.matches[matchIndex].status = 'finished';
          }
          if (this.currentMatch && this.currentMatch.id === id) {
            this.currentMatch.home_score = scoreData.home_score;
            this.currentMatch.away_score = scoreData.away_score;
            this.currentMatch.status = 'finished';
          }
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar marcador';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteMatch(id: number) {
      const { $api } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $api.delete(`/matches/${id}`);
        
        if (response.data.success) {
          await this.fetchMatches();
          return { success: true };
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al eliminar partido';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});
