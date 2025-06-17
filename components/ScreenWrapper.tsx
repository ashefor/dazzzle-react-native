// components/ScreenWrapper.tsx
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends ViewProps {
  children: React.ReactNode;
  withHeader?: boolean;
  withBottomTabs?: boolean;
}

export const ScreenWrapper: React.FC<Props> = ({ children, withHeader = true, withBottomTabs = false, style, ...rest }) => {
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 56;
  const BOTTOM_TABS_HEIGHT = 80;

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: withHeader ? insets.top + HEADER_HEIGHT : insets.top,
          paddingBottom: withBottomTabs ? insets.bottom + BOTTOM_TABS_HEIGHT : insets.bottom,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
