import { TripPlan, TripRequest, TripSummary } from '../types/trip';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = {
  async health(): Promise<{ status: string; service: string; integrations: Record<string, string> }> {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async planTrip(request: TripRequest): Promise<TripPlan> {
    const res = await fetch(`${API_BASE}/api/trips/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate plan' }));
      throw new Error(err.detail || 'Failed to generate trip plan');
    }
    return res.json();
  },

  async refineTrip(tripId: string, prompt: string, currentPlan?: TripPlan): Promise<TripPlan> {
    const res = await fetch(`${API_BASE}/api/trips/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip_id: tripId, prompt, current_plan: currentPlan }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to refine plan' }));
      throw new Error(err.detail || 'Failed to refine trip plan');
    }
    return res.json();
  },

  async getSavedTrips(): Promise<TripSummary[]> {
    const res = await fetch(`${API_BASE}/api/trips`);
    if (!res.ok) throw new Error('Failed to fetch saved trips');
    return res.json();
  },

  async getTripById(id: string): Promise<TripPlan> {
    const res = await fetch(`${API_BASE}/api/trips/${id}`);
    if (!res.ok) throw new Error('Trip not found');
    return res.json();
  },

  async deleteTrip(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/trips/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete trip');
  },
};
