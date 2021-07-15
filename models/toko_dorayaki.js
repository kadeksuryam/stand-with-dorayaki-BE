
const mongoose = require('mongoose')

const tokoDorayakiSchema = new mongoose.Schema({
    nama : {
        type: String,
        required: [true, 'nama toko tidak boleh kosong']
    },
    jalan : {
        type : String,
        required: [true, 'jalan toko tidak boleh kosong']
    },
    kecamatan : {
        type : String,
        required: [true, 'kecamatan toko tidak boleh kosong']
    },
    provinsi : {
        type : String,
        required : [true, 'provinsi toko tidak boleh kosong']
    },
    gambar : {
        type : String,
        default : 'default-toko-dorayaki.png'
    }
}, {timestamps: true})


const tokoDorayakiModel = mongoose.model('TokoDorayaki', tokoDorayakiSchema)

module.exports = tokoDorayakiModel