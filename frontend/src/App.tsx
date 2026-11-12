import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { TripResultsPage } from './pages/TripResultsPage';
import { SavedTripsPage } from './pages/SavedTripsPage';
import { AboutPage } from './pages/AboutPage';
import { api } from './services/api';
import { TripPlan, TripRequest, TripSummary } from './types/trip';

export function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'plan' | 'results' | 'saved' | 'about'>('landing');
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [prefillValues, setPrefillValues] = useState<Partial<TripRequest> | undefined>(undefined);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load saved trips on mount
  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = async () => {
    try {
      const trips = await api.getSavedTrips();
      setSavedTrips(trips);
    } catch (e) {
      console.warn('Could not load saved trips from backend:', e);
    }
  };

  const handleStartPlanning = (prefill?: Partial<TripRequest>) => {
    setPrefillValues(prefill);
    setCurrentPage('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreSample = (destination: string) => {
    handleStartPlanning({
      origin: 'Mumbai',
      destination,
      total_budget: 20000,
      travellers: 2,
      travel_style: 'Standard',
      preferred_transport: 'Train'
    });
  };

  const handleFormSubmit = async (request: TripRequest) => {
    setIsLoading(true);
    try {
      const plan = await api.planTrip(request);
      setCurrentPlan(plan);
      setCurrentPage('results');
      addToast('success', `Generated ${plan.duration_days}-day itinerary to ${plan.destination}!`);
      loadSavedTrips();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      addToast('error', err.message || 'Failed to generate trip plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineTrip = async (prompt: string) => {
    if (!currentPlan) return;
    setIsRefining(true);
    try {
      const updatedPlan = await api.refineTrip(currentPlan.id, prompt, currentPlan);
      setCurrentPlan(updatedPlan);
      addToast('success', 'Plan refined according to your instructions!');
      loadSavedTrips();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to refine trip plan.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleSelectSavedTrip = async (tripId: string) => {
    try {
      const plan = await api.getTripById(tripId);
      setCurrentPlan(plan);
      setCurrentPage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      addToast('error', 'Could not open saved trip.');
    }
  };

  const handleDeleteSavedTrip = async (tripId: string) => {
    try {
      await api.deleteTrip(tripId);
      setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
      addToast('info', 'Trip deleted from database.');
      if (currentPlan?.id === tripId) {
        setCurrentPlan(null);
        setCurrentPage('saved');
      }
    } catch (err: any) {
      addToast('error', 'Failed to delete trip.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedTrips.length}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage 
            onStartPlanning={handleStartPlanning}
            onExploreTrip={handleExploreSample}
          />
        )}

        {currentPage === 'plan' && (
          <PlanTripPage 
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            prefillValues={prefillValues}
          />
        )}

        {currentPage === 'results' && currentPlan && (
          <TripResultsPage 
            plan={currentPlan}
            onBackToPlan={() => setCurrentPage('plan')}
            onRefine={handleRefineTrip}
            isRefining={isRefining}
            onSaveNotice={() => addToast('success', 'Itinerary is saved and indexed in your SQLite database.')}
          />
        )}

        {currentPage === 'saved' && (
          <SavedTripsPage 
            trips={savedTrips}
            onSelectTrip={handleSelectSavedTrip}
            onDeleteTrip={handleDeleteSavedTrip}
            onPlanNewTrip={() => handleStartPlanning()}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage 
            onStartPlanning={() => handleStartPlanning()}
          />
        )}
      </main>

      {/* Toast Alert Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <Footer 
        onNavigate={(page) => {
          setCurrentPage(page as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
