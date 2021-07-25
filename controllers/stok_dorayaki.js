const stokDorayakiRouter = () => {
  const StokDorayaki = require('../models/stok_dorayaki');
  const router = require('express').Router();

  // GET STOK BY Query
  router.get('/', async (req, res, next) => {
    try {
      const query = {};
      const { idDorayaki, idToko } = req.query;
      if (idDorayaki) query.dorayaki = idDorayaki;
      if (idToko) query.tokoDorayaki = idToko;

      const stokToko = (await StokDorayaki.find(query).populate('dorayaki'));

      res.status(200).json(stokToko);
    } catch (err) {
      next(err);
    }
  });

  // Update a Stok
  router.put('/:id', async (req, res, next) => {
    try {
      const idStok = req.params.id;
      const { stok } = req.body;

      if (stok < 0) next(new Error('jumlah stok haruslah positif'));
      else {
        const updatedStok = (await StokDorayaki.findByIdAndUpdate(idStok, { stok }, { new: true }).populate('dorayaki'));
        res.status(200).json(updatedStok);
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
};

module.exports = stokDorayakiRouter;
