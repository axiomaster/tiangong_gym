export const colors = {
  brand_pink: '#FE2C55',
  brand_cyan: '#25F4EE',
  bg_dark: '#000000',
  surface_dark: '#161622',
  text_white: '#FFFFFF',
  text_muted: 'rgba(255,255,255,0.6)',
  star_yellow: '#FACE15',
} as const;

export const colorsDark: Partial<typeof colors> = {} as const;
