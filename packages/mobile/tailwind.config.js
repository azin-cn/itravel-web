/**
 * daisyui: https://daisyui.com/docs/config/
 */
module.exports = {
  important: 'body',
  content: ['./src/**/*.{vue,js,ts}'],
  // add daisyUI plugin
  plugins: [require('daisyui')],
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [
      {
        light: {
          'primary': '#f4bbab',
          'secondary': '#07ea47',
          'accent': '#ce4869',
          'neutral': '#312933',
          'base-100': '#F7F7F8',
          'info': '#9CB6F7',
          'success': '#135847',
          'warning': '#F4A81A',
          'error': '#EF3A1A',
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
  },
};
