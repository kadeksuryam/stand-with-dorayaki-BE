
const mongoose = require('mongoose')

const stokDorayakiSchema = new mongoose.Schema({
    idDorayaki : {
        type: String,
        required: [true, 'id dorayaki tidak boleh kosong']
    },
    idTokoDorayaki : {
        type: String,
        required: [true, 'id toko tidak boleh kosong']
    },
    stok: {
        type: Number,
        required : [true, 'field stok tidak boleh kosong'],
        default : 0,
        minimum : [0, 'stok haruslah lebih besar atau sama dengan nol'],
        validate : {
            validator: Number.isInteger,
            message : '{VALUE} bukanlah integer'
        }
    }
}, {timestamps: true})

stokDorayakiSchema.index({"idDorayaki":1, "idTokoDorayaki":1}, {unique: true})

const stokDorayakiModel = mongoose.model('StokDorayaki', stokDorayakiSchema)

module.exports = stokDorayakiModel