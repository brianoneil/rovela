import { StyleSheet, Text, View } from 'react-native';

import { homeText } from './homeText';

/**
 * Caps section title ("Your trips").
 * TODO: Add the "See all" link once a full trips list screen exists.
 */
export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Text style={homeText.capsLabel} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
