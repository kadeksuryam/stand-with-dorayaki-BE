const assetsRouter = require('express').Router();

assetsRouter.get('/dorayaki/:fileName', (req, res, next) => {
  try {
    const { fileName } = req.params;
    res.sendFile(`${fileName}`, { root: './assets/dorayaki/' });
  } catch (err) {
    next(err);
  }
});

assetsRouter.get('/toko-dorayaki/:fileName', (req, res, next) => {
  try {
    const { fileName } = req.params;
    res.sendFile(`${fileName}`, { root: './assets/toko-dorayaki/' });
  } catch (err) {
    next(err);
  }
});

module.exports = assetsRouter;
