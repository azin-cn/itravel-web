import {
  defineConfig,
  presetUno,
  presetAttributify,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify({
      prefix: 'uno',
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
