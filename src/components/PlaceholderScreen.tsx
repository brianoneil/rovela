import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';

interface PlaceholderScreenProps {
  /** Screen name as it appears in the Paper designs. */
  title: string;
  /** Short note on what the finished screen will do. */
  description: string;
  children?: ReactNode;
}

/**
 * Stand-in for a route whose screen has not been built yet.
 * TODO: Remove once every route is built from its approved Paper design.
 */
export function PlaceholderScreen({ title, description, children }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <AppText variant="label">Not built yet</AppText>
        <AppText variant="display">{title}</AppText>
        <AppText variant="caption">{description}</AppText>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.ground,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[5],
  },
});
