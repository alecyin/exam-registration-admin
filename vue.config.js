module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 88,
        proxy: {
            '/':{
                target:'http://47.105.93.192/api',
                changeOrigin:true
                // pathRewrite:{
                //     '/':''
                // }
            }
        }
    }
}