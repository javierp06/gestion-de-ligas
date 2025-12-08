import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

interface FavoriteItem {
  id: number;
  name: string;
  logo?: string;
  sport_id?: number;
  short_name?: string; // For teams
  status?: string; // For tournaments
}

interface FavoritesState {
  leagues: FavoriteItem[];
  teams: FavoriteItem[];
  tournaments: FavoriteItem[];
  loading: boolean;
}

export const useFavoritesStore = defineStore('favorites', {
  state: (): FavoritesState => ({
    leagues: [],
    teams: [],
    tournaments: [],
    loading: false
  }),

  actions: {
    async fetchFavorites() {
      const { $api } = useNuxtApp();
      const authStore = useAuthStore();
      
      if (!authStore.isAuthenticated) {
        this.leagues = [];
        this.teams = [];
        this.tournaments = [];
        return;
      }

      this.loading = true;
      try {
        const response = await $api.get('/favorites');
        if (response.data.success) {
          const { leagues, teams, tournaments } = response.data.data;
          this.leagues = leagues || [];
          this.teams = teams || [];
          this.tournaments = tournaments || [];
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(type: 'league' | 'team' | 'tournament', id: number) {
      const { $api } = useNuxtApp();
      const authStore = useAuthStore();
      
      if (!authStore.isAuthenticated) {
        const router = useRouter();
        router.push('/register?redirect=favorite'); // Simple redirect for now
        return false;
      }

      const isFavorite = this.isFavorite(type, id);

      // Optimistic update
      // (Simplified: we actually need the full object to add it optimistically, which we might not have here easily without passing it.
      // So we'll relying on re-fetch or just UI toggle state for now).
      
      try {
        if (isFavorite) {
            await $api.delete('/favorites', { data: { entityType: type, entityId: id } });
            // Remove from local state
            if (type === 'league') this.leagues = this.leagues.filter(i => i.id !== id);
            if (type === 'team') this.teams = this.teams.filter(i => i.id !== id);
            if (type === 'tournament') this.tournaments = this.tournaments.filter(i => i.id !== id);
        } else {
            await $api.post('/favorites', { entityType: type, entityId: id });
            // We re-fetch to get the full names/logos, or we could pass them to this action.
            await this.fetchFavorites(); 
        }
        return true;
      } catch (error) {
        console.error('Error toggling favorite:', error);
        // Revert on error would go here
        return false;
      }
    }
  },

  getters: {
    isFavorite: (state) => (type: 'league' | 'team' | 'tournament', id: number) => {
        if (type === 'league') return state.leagues.some(i => i.id === id);
        if (type === 'team') return state.teams.some(i => i.id === id);
        if (type === 'tournament') return state.tournaments.some(i => i.id === id);
        return false;
    }
  }
});
