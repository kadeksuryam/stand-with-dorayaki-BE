const mongoose = require('mongoose');

const dorayakiSchema = new mongoose.Schema({
  rasa: {
    type: String,
    required: [true, 'rasa dorayaki tidak boleh kosong'],
  },
  deskripsi: {
    type: String,
  },
  gambar: {
    type: String,
    default: '/assets/dorayaki/default-dorayaki.png',
  },
}, { timestamps: true });

const dorayakiModel = mongoose.model('Dorayaki', dorayakiSchema);

module.exports = dorayakiModel;
