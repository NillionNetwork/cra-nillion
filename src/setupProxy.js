const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/rpc',
    createProxyMiddleware({
      target: 'https://testnet-nillion-rpc.lavenderfive.com',
      changeOrigin: true,
      ws: true, // Enable WebSocket proxying
      pathRewrite: {
        '^/rpc': '',
      },
    })
  );
};
