const axios = require('axios');
const faker = require('faker');
const TokoDorayaki = require('../models/toko_dorayaki');
const Dorayaki = require('../models/dorayaki');
const StokDorayaki = require('../models/stok_dorayaki');
const logger = require('../utils/logger');

const seedToko = async () => {
  // seed 10 toko, random
  try {
    for (let i = 0; i < 9; i++) {
      const nama = faker.company.companyName();
      const jalan = `Jalan${faker.address.streetName()}`;

      // random provinsi
      const dataProvinsi = (await axios.get('https://dev.farizdotid.com/api/daerahindonesia/provinsi')).data.provinsi;
      const provinsi = dataProvinsi[Math.floor(Math.random() * dataProvinsi.length)];

      // random kabupaten
      const dataKabupaten = (await axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${provinsi.id}`)).data.kota_kabupaten;
      const kabupaten = dataKabupaten[Math.floor(Math.random() * dataKabupaten.length)];

      // random kecamatan
      const dataKecamatan = (await axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${kabupaten.id}`)).data.kecamatan;
      const kecamatan = dataKecamatan[Math.floor(Math.random() * dataKecamatan.length)];

      const postData = {
        nama, jalan, provinsi: provinsi.nama, kabupaten: kabupaten.nama, kecamatan: kecamatan.nama,
      };
      const newTokoDorayaki = new TokoDorayaki(postData);

      const savedTokoDorayaki = await newTokoDorayaki.save();

      // When a toko has created, all dorayaki should connect to this toko
      const dorayakiIDs = (await Dorayaki.find({})).map((dorayaki) => dorayaki._id);
      const postStok = [];

      for (let j = 0; j < dorayakiIDs.length; j++) {
        postStok.push({ dorayaki: dorayakiIDs[j], tokoDorayaki: savedTokoDorayaki._id });
      }

      await StokDorayaki.insertMany(postStok);
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = seedToko;
