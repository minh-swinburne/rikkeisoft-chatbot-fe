export const plugins = {
  'postcss-preset-env': {
    stage: 1, // Enable modern CSS features (e.g., nesting)
    features: {
      'nesting-rules': true, // Enable CSS nesting
    },
  },
  autoprefixer: {}, // Add vendor prefixes automatically
};
