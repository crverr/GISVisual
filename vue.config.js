const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // devServer: {
  //   proxy: {
  //     '/api':{
  //       target: 'http://localhost:8899',
  //       pathRewrite: { "^/api": "" },
  //       changeOrigin:true,    //必须，允许跨域
  //     }
  //   }
  // }
  devServer: {
    proxy: 'http://localhost:8899'
  }
})
