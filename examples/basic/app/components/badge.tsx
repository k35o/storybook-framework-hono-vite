import { makePillStyle } from '../lib/theme';

export interface BadgeProps {
  color: string;
  label: string;
}

export const Badge = ({ color, label }: BadgeProps) => {
  return <div style={makePillStyle(color)}>{label}</div>;
};
