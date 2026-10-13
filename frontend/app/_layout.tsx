import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { getSettings } from '@/lib/api';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors, fontAssets } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // The daily review cap lives in the backend; until it answers the default (15) stands.
  useEffect(() => {
    getSettings()
      .then(({ dailyReviewCap }) => useSettingsStore.getState().setDailyReviewCap(dailyReviewCap))
      .catch((err) => console.warn('Could not load settings', err));
  }, []);

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
}
