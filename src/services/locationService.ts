import { API_URL } from '../config/api';

const API_BASE_URL = `${API_URL}/api/locations`;

export interface LocationOption {
  id?: string;
  value: string;
  label: string;
  name: string;
}

export interface LocationHierarchy {
  countries?: LocationOption[];
  states?: LocationOption[];
  districts?: LocationOption[];
  taluks?: LocationOption[];
  villages?: LocationOption[];
}

class LocationService {
  private cache = new Map<string, LocationOption[]>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async fetchWithCache(url: string, cacheKey: string): Promise<LocationOption[]> {
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const locations = data.data || [];
      
      // Cache the result
      this.cache.set(cacheKey, locations);
      
      // Clear cache after timeout
      setTimeout(() => {
        this.cache.delete(cacheKey);
      }, this.cacheTimeout);

      return locations;
    } catch (error) {
      console.error('Location service error:', error);
      throw error;
    }
  }

  /**
   * Get all countries
   */
  async getCountries(): Promise<LocationOption[]> {
    return this.fetchWithCache(`${API_BASE_URL}/countries`, 'countries');
  }

  /**
   * Get states for a specific country
   */
  async getStates(country: string): Promise<LocationOption[]> {
    if (!country) return [];
    return this.fetchWithCache(`${API_BASE_URL}/states/${country}`, `states-${country}`);
  }

  /**
   * Get districts for a specific state
   */
  async getDistricts(state: string): Promise<LocationOption[]> {
    if (!state) return [];
    return this.fetchWithCache(`${API_BASE_URL}/districts/${state}`, `districts-${state}`);
  }

  /**
   * Get taluks for a specific district
   */
  async getTaluks(district: string): Promise<LocationOption[]> {
    if (!district) return [];
    return this.fetchWithCache(`${API_BASE_URL}/taluks/${district}`, `taluks-${district}`);
  }

  /**
   * Get villages for a specific taluk
   */
  async getVillages(taluk: string): Promise<LocationOption[]> {
    if (!taluk) return [];
    return this.fetchWithCache(`${API_BASE_URL}/villages/${taluk}`, `villages-${taluk}`);
  }

  /**
   * Search locations by query
   */
  async searchLocations(
    query: string,
    type: 'state' | 'district' | 'taluk' | 'village',
    limit: number = 20
  ): Promise<LocationOption[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  /**
   * Get location hierarchy for building cascading dropdowns
   */
  async getLocationHierarchy(
    country?: string,
    state?: string,
    district?: string,
    taluk?: string
  ): Promise<LocationHierarchy> {
    try {
      const params = new URLSearchParams();
      if (country) params.append('country', country);
      if (state) params.append('state', state);
      if (district) params.append('district', district);
      if (taluk) params.append('taluk', taluk);

      const response = await fetch(`${API_BASE_URL}/hierarchy?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Location hierarchy error:', error);
      return {};
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get Tamil Nadu districts (commonly used)
   */
  async getTamilNaduDistricts(): Promise<LocationOption[]> {
    return this.getDistricts('tamilnadu');
  }

  /**
   * Search Tamil Nadu villages (for autocomplete)
   */
  async searchTamilNaduVillages(query: string, limit: number = 10): Promise<LocationOption[]> {
    return this.searchLocations(query, 'village', limit);
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService; 