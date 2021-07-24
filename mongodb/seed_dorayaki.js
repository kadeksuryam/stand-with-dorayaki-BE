const TokoDorayaki = require('../models/toko_dorayaki');
const Dorayaki = require('../models/dorayaki');
const StokDorayaki = require('../models/stok_dorayaki');
const logger = require('../utils/logger');

const seedDorayaki = async () => {
  try {
    const bulkDorayaki = [
      { rasa: 'coklat', deskripsi: 'memiliki tekstur lembut', gambar: '/assets/dorayaki/default-dorayaki.png' },
      { rasa: 'oreo', deskripsi: 'merupakan campuran dari beberapa oreo', gambar: '/assets/dorayaki/dorayaki-oreo.png' },
      { rasa: 'strawberry', deskripsi: 'merupakan campuran buah strawberry dan coklat', gambar: '/assets/dorayaki/dorayaki-strawberry.png' },
      { rasa: 'ice cream', deskripsi: 'merupakan campuran dari beberapa ice cream', gambar: '/assets/dorayaki/dorayaki-ice-cream.png' },
      { rasa: 'matcha', deskripsi: 'memiliki rasa matcha yang pekat', gambar: '/assets/dorayaki/dorayaki-matcha' },
    ];

    for (let i = 0; i < bulkDorayaki.length; i++) {
      /* eslint-enable no-await-in-loop */
      const postData = bulkDorayaki[i];
      const newDorayaki = new Dorayaki(postData);

      const savedDorayaki = await newDorayaki.save();

      // When a dorayaki has created, all toko should connect to this dorayaki
      const tokoDorayakiIDs = (await TokoDorayaki.find({})).map((dorayaki) => dorayaki._id);
      const postStok = [];

      for (let j = 0; j < tokoDorayakiIDs.length; j++) {
        postStok.push({ dorayaki: savedDorayaki._id, tokoDorayaki: tokoDorayakiIDs[j] });
      }
      await StokDorayaki.insertMany(postStok);
      /* eslint-enable no-await-in-loop */
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = seedDorayaki;
