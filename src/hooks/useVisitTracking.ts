import { useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface VisitResponse {
  firstVisitToday?: boolean;
}

export const useVisitTracking = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Check if we already tracked today using localStorage
        // const lastTracked = localStorage.getItem('lastVisitTracked');
        // const today = new Date().toDateString();

        // if (lastTracked === today) {
        //   return; // Already tracked today
        // }

        await apiClient.post<VisitResponse>('/users/visit', {
          path: window.location.pathname,
        });

        // const response = await apiClient.post<VisitResponse>('/users/visit', {
        //     path: window.location.pathname,
        // });

        // if (response.success && response.data?.firstVisitToday) {
        //   localStorage.setItem('lastVisitTracked', today);
        // }
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []);
};
