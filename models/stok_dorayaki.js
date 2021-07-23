const mongoose = require('mongoose');

const stokDorayakiSchema = new mongoose.Schema({
  dorayaki: {
    type: String,
    ref: 'Dorayaki',
    required: [true, 'id dorayaki tidak boleh kosong'],
  },
  tokoDorayaki: {
    type: String,
    ref: 'TokoDorayaki',
    required: [true, 'id toko tidak boleh kosong'],
  },
  stok: {
    type: Number,
    default: 0,
    minimum: [0, 'stok haruslah lebih besar atau sama dengan nol'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} bukanlah integer',
    },
  },
}, { timestamps: true });

stokDorayakiSchema.index({ dorayaki: 1, tokoDorayaki: 1 }, { unique: true });

const stokDorayakiModel = mongoose.model('StokDorayaki', stokDorayakiSchema);

module.exports = stokDorayakiModel;
