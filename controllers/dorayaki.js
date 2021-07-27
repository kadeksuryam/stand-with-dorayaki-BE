const dorayakiRouter = () => {
  const TokoDorayaki = require('../models/toko_dorayaki');
  const Dorayaki = require('../models/dorayaki');
  const StokDorayaki = require('../models/stok_dorayaki');
  const router = require('express').Router();
  const path = require('path');
  const { v4: uuidv4 } = require('uuid');
  const fs = require('fs');

  // CREATE
  const multer = require('multer');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../assets/dorayaki/'));
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}.${uuidv4()}.png`;
      req.fileName = fileName;
      cb(null, fileName);
    },
  });

  // Konfigurasi Uploaded File
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if (ext !== '.png') {
        req.fileError = 'Ekstensi file haruslah png';
      }
      cb(null, true);
    },
    limits: {
      // 5*2^20 bytes ~ 5 MB Max
      fileSize: 5 * 1024 * 1024,
    },
  });

  router.post('/', upload.single('gambar'), async (req, res, next) => {
    try {
      if (req.fileError) {
        next(new Error(req.fileError));
      } else {
        const { rasa, deskripsi } = req.body;

        const postData = { rasa, deskripsi };

        if (req.fileName) postData.gambar = `/assets/dorayaki/${req.fileName}`;

        const newDorayaki = new Dorayaki(postData);

        const savedDorayaki = await newDorayaki.save();

        // When a dorayaki has created, all toko should connect to this dorayaki
        const tokoDorayakiIDs = (await TokoDorayaki.find({})).map((dorayaki) => dorayaki._id);
        const postStok = [];

        for (let i = 0; i < tokoDorayakiIDs.length; i++) {
          postStok.push({ dorayaki: savedDorayaki._id, tokoDorayaki: tokoDorayakiIDs[i] });
        }

        await StokDorayaki.insertMany(postStok);

        res.status(201).json(savedDorayaki);
      }
    } catch (error) {
      next(error);
    }
  });

  // READ ALL DORAYAKI
  router.get('/', async (req, res, next) => {
    try {
      const dorayakis = await Dorayaki.find({});

      res.status(200).json(dorayakis);
    } catch (err) {
      next(err);
    }
  });

  // READ A DORAYAKI
  router.get('/:id', async (req, res, next) => {
    try {
      const dorayakiID = req.params.id;
      const dorayaki = await Dorayaki.findById(dorayakiID);

      if (!dorayaki) res.status(404).json({ error: 'dorayaki dengan ID tersebut tidak ditemukan' });
      else res.status(200).json(dorayaki);
    } catch (err) {
      next(err);
    }
  });

  // UPDATE A DORAYAKI
  router.put('/:id', upload.single('gambar'), async (req, res, next) => {
    try {
      if (req.fileError) {
        next(new Error(req.fileError));
      } else {
        const dorayakiID = req.params.id;
        const { rasa, deskripsi } = req.body;

        const dataUpdate = {};
        if (rasa) dataUpdate.rasa = rasa;
        if (deskripsi) dataUpdate.deskripsi = deskripsi;
        if (req.fileName) dataUpdate.gambar = `/assets/dorayaki/${req.fileName}`;

        const updatedDorayaki = await Dorayaki.findByIdAndUpdate(dorayakiID, dataUpdate, { new: true });

        if (!updatedDorayaki) res.status(404).json({ error: 'dorayaki dengan ID tersebut tidak ditemukan' });
        else res.status(200).json(updatedDorayaki);
      }
    } catch (err) {
      next(err);
    }
  });

  // DELETE A DORAYAKI
  router.delete('/:id', async (req, res, next) => {
    try {
      const dorayakiID = req.params.id;

      // delete from MONGODB
      const delRes = await Dorayaki.findByIdAndDelete(dorayakiID);

      if (!delRes) res.status(404).json({ error: 'dorayaki dengan ID tersebut tidak ditemukan' });
      else {
        await StokDorayaki.deleteMany({ dorayaki: delRes._id });

        // delete from FILE SYSTEM
        if (delRes.gambar !== '/assets/dorayaki/default-dorayaki.png') {
          fs.unlinkSync(`.${delRes.gambar}`);
        }

        res.status(200).send({ success: 'dorayaki berhasil dihapus' });
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
};

module.exports = dorayakiRouter;
