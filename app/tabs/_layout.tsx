import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Shadow } from '@/constants/theme';
import { useAppStore } from '@/store/appStore';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color:   string;
  label:   string;
  badge?:  number;
};

function TabIcon({ name, focused, color, label, badge }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconActive]}>
        <Ionicons
          name={focused ? name : `${name}-outline` as keyof typeof Ionicons.glyphMap}
          size={22}
          color={focused ? Colors.primary : Colors.textMuted}
        />
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, { color: focused ? Colors.primary : Colors.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const unreadCount = useAppStore((s) => s.unreadCount);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="timer" focused={focused} color={color} label="Focus" />
          ),
        }}
      />
      <Tabs.Screen
        name="recovery"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="heart" focused={focused} color={color} label="Recover" />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bar-chart" focused={focused} color={color} label="Insights" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="person"
              focused={focused}
              color={color}
              label="Profile"
              badge={unreadCount}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          80,
    backgroundColor: Colors.surface,
    borderTopWidth:  1,
    borderTopColor:  Colors.borderSubtle,
    elevation:       0,
    ...Shadow.sm,
    paddingBottom:   Platform.OS === 'ios' ? 20 : 8,
  },
  tabItem: {
    alignItems: 'center',
    paddingTop: 8,
    gap: 4,
  },
  iconWrap: {
    width:          40,
    height:         32,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
    position:       'relative',
  },
  iconActive: {
    backgroundColor: Colors.glowCyan,
  },
  tabLabel: {
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.2,
  },
  badge: {
    position:     'absolute',
    top:          -4,
    right:        -6,
    minWidth:     16,
    height:       16,
    borderRadius: 8,
    backgroundColor: Colors.danger,
    alignItems:   'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize:   9,
    fontWeight: '700',
    color:      '#FFF',
  },
});
