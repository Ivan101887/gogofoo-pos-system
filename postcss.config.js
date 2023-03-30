module.exports = {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.js',
    },
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    autoprefixer: {},
  },
};
