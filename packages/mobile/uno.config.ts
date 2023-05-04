import {
  defineConfig,
  presetUno,
  presetAttributify,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  // include: ['**/*.{html,js,ts,jsx,tsx,vue,svelte,astro,css,scss}', './src/**/*.vue',],
  include: [/(src).*.([sl]?css|vue|[jt]sx?)$/],
  exclude: [],
  presets: [
    presetUno(),
    presetAttributify({
      prefix: 'uno',
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
