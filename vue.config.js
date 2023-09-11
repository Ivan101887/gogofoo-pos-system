/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
const { defineConfig } = require('@vue/cli-service');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

const { VantResolver } = require('@vant/auto-import-resolver');

module.exports = defineConfig({
  outputDir: 'dist',
  publicPath: '/',
  devServer: {
    port: 8084,
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/utils/variables.scss";
        `,
      },
    },
  },
  filenameHashing: false,
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        components: '@/components',
      },
    },
    plugins: [
      AutoImport({
        resolver: [ElementPlusResolver()],
      }),
      Components({
        resolver: [VantResolver(), ElementPlusResolver()],
      }),
    ],
  },
});
