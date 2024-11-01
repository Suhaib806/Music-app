// hooks/useCurrentRoute.js
import React, { useEffect, useState } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const useCurrentRoute = () => {
  const [currentRouteName, setCurrentRouteName] = useState(null);

  useEffect(() => {
    const navigationRef = NavigationContainerRef.current;

    if (!navigationRef) return;

    const listener = navigationRef.addListener('state', (e) => {
      const route = e.data.state.routes[e.data.state.index];
      setCurrentRouteName(route.name);
    });

    return () => listener.remove();
  }, []);

  return currentRouteName;
};
 