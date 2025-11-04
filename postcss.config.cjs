// Tailwind v4 moved the PostCSS plugin into a separate package.
// Use `@tailwindcss/postcss` here.
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
}


