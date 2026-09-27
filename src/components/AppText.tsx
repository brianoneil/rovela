import { Text, type TextProps } from 'react-native';

import { textVariants, type TextVariant } from '@/theme';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

/** Text that always uses a Paper-token typography variant. */
export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  return <Text style={[textVariants[variant], style]} {...rest} />;
}
