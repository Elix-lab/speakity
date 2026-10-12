import type { ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, type ColorToken } from '@/theme';

/**
 * Icons copied from prototype.html (const ICON). Stroke icons use the
 * prototype defaults: 24 viewBox, round caps/joins, stroke 2.6 unless the
 * prototype sets another width for that icon.
 */
export type IconName =
  | 'flame'
  | 'mic'
  | 'chev'
  | 'check'
  | 'x'
  | 'home'
  | 'cards'
  | 'plus'
  | 'play'
  | 'pause'
  | 'eye'
  | 'eyeOff'
  | 'sound';

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorToken;
};

const strokeWidth: Partial<Record<IconName, number>> = {
  chev: 3,
  check: 3.4,
  x: 3,
  plus: 3.2,
  play: 2.2,
};

export function Icon({ name, size = 24, color = 'ink' }: IconProps) {
  const c = colors[color];

  if (name === 'flame') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={c}>
        <Path d="M12.6 2.2c.3 2.6-.8 4.2-2.3 5.9C8.6 9.9 7 11.6 7 14.4A5.2 5.2 0 0 0 12 20a5.2 5.2 0 0 0 5-5.4c0-1.7-.7-3-1.6-4.2-.3 1.1-.9 1.8-1.7 2.2.6-3.2-.1-6.8-1.1-10.4z" />
      </Svg>
    );
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth={strokeWidth[name] ?? 2.6}
      strokeLinecap="round"
      strokeLinejoin="round">
      {paths[name]}
    </Svg>
  );
}

const paths: Record<Exclude<IconName, 'flame'>, ReactNode> = {
  mic: (
    <>
      <Rect x="9" y="3" width="6" height="11" rx="3" />
      <Path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  chev: <Path d="M9 5l7 7-7 7" />,
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <Path d="M6 6l12 12M18 6L6 18" />,
  home: (
    <>
      <Path d="M3 11l9-8 9 8" />
      <Path d="M5 10v10h5v-6h4v6h5V10" />
    </>
  ),
  cards: (
    <>
      <Rect x="3" y="7" width="13" height="13" rx="3" />
      <Path d="M8 4h10a3 3 0 0 1 3 3v9" />
    </>
  ),
  plus: <Path d="M12 5v14M5 12h14" />,
  play: <Path d="M7 4l13 8-13 8z" />,
  eye: (
    <>
      <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <Circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <Path d="M3 3l18 18" />
      <Path d="M10.6 5.1A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.3 4.2M6.5 6.6A17 17 0 0 0 2 12s3.6 7 10 7c1.5 0 2.8-.4 4-.9" />
    </>
  ),
  sound: (
    <>
      <Path d="M4 9v6h4l5 4V5L8 9z" />
      <Path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  pause: (
    <>
      <Rect x="6" y="4" width="4" height="16" rx="1.5" />
      <Rect x="14" y="4" width="4" height="16" rx="1.5" />
    </>
  ),
};

