import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown:  false,
        contentStyle: { backgroundColor: Colors.background },
        animation:    'slide_from_right',
      }}
    >
      <Stack.Screen name="energy-ring"      />
      <Stack.Screen name="dopamine-detox"   />
      <Stack.Screen name="heatmap"          />
      <Stack.Screen name="screen-time"      />
      <Stack.Screen name="ai-coach"         />
      <Stack.Screen name="habit-tracker"    />
      <Stack.Screen name="sleep-analysis"   />
      <Stack.Screen name="progress"         />
      <Stack.Screen name="ecosystem"        />
      <Stack.Screen name="achievements"     />
      <Stack.Screen name="challenges"       />
      <Stack.Screen name="notifications"    />
      <Stack.Screen name="settings"         />
      <Stack.Screen name="customization"    />
      <Stack.Screen name="privacy"          />
      <Stack.Screen name="logout"           />
      <Stack.Screen name="recovery-exercise"/>
    </Stack>
  );
}
