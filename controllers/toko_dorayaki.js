const tokoDorayakiRouter = (redisClient) => {
    const TokoDorayaki = require('../models/toko_dorayaki')
    const Dorayaki = require('../models/dorayaki')
    const StokDorayaki = require('../models/stok_dorayaki')
    const router = require('express').Router()
    const path = require('path')
    const { v4: uuidv4 } = require('uuid')
    const fs = require('fs')

    //CREATE
    const multer = require('multer')
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname,'../assets/toko-dorayaki/'))
        },
        filename: (req, file, cb) => {
            const fileName = Date.now() + '.' + uuidv4() + '.png'
            req.fileName = fileName
            cb(null, fileName)
        }
    })

    //Konfigurasi Uploaded File
    const upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            if(ext != '.png'){
                return cb(new Error('Ekstensi file haruslah png'))
            }
            cb(null, true)
        },
        limits:{
            //5*2^20 bytes ~ 5 MB Max
            fileSize: 5*1024*1024
        }
    })

    router.post('/', upload.single('gambar'), async(req, res, next) => {
        try{
            const { nama, jalan, kabupaten, kecamatan, provinsi  } = req.body
            let postData = {nama, jalan, kabupaten, kecamatan, provinsi}

            if(req.fileName) postData["gambar"] = `/assets/toko-dorayaki/${req.fileName}`

            const newTokoDorayaki = new TokoDorayaki(postData)
    
            const savedTokoDorayaki = await newTokoDorayaki.save()

            //When a toko has created, all dorayaki should connect to this toko
            const dorayakiIDs = (await Dorayaki.find({})).map((dorayaki) => dorayaki["_id"])
            let postStok = []
            
            for(id of dorayakiIDs){
                postStok.push({dorayaki: id, tokoDorayaki: savedTokoDorayaki["_id"]})
            }
            
            await StokDorayaki.insertMany(postStok)
            
            res.status(201).json(savedTokoDorayaki)
        } catch(error){
            next(error)
        }
    })

    //READ ALL TOKO DORAYAKI
    router.get('/', async(req, res, next) => {
        try{
            const tokoDorayakis = await TokoDorayaki.find({})
            return res.status(200).json(tokoDorayakis)
        }catch(err){
            next(err);
        }
    })

    //READ A DORAYAKI
    router.get('/:id', async(req, res, next) => {
        try{
            const tokoDorayakiID = req.params.id
            const tokoDorayaki = await TokoDorayaki.findById(tokoDorayakiID)
            
            if(!tokoDorayaki) return res.status(404).json({error: 'toko dorayaki dengan ID tersebut tidak ditemukan'})
            else return res.status(200).json(tokoDorayaki)
        } catch(err){
            next(err)
        }
    })

    //UPDATE A TOKO DORAYAKI
    router.put('/:id', upload.single('gambar'), async(req, res, next) => {
        try{
            const tokoDorayakiID = req.params.id
            const { nama, jalan, kabupaten, kecamatan, provinsi  } = req.body

            const dataUpdate = {}
            if(nama) dataUpdate["nama"] = nama
            if(jalan) dataUpdate["jalan"] = jalan
            if(kabupaten) dataUpdate["kabupaten"] = kabupaten
            if(kecamatan) dataUpdate["kecamatan"] = kecamatan
            if(provinsi) dataUpdate["provinsi"] = provinsi
            if(req.fileName) dataUpdate["gambar"] = `/assets/toko-dorayaki/${req.fileName}`

            const updatedTokoDorayaki = await TokoDorayaki.findByIdAndUpdate(tokoDorayakiID, dataUpdate, {new: true})

            if(!updatedTokoDorayaki) return res.status(404).json({error: 'toko dorayaki dengan ID tersebut tidak ditemukan'})
            else return res.status(200).json(updatedTokoDorayaki)
            
        } catch(err){
            next(err)
        }
    })

    //DELETE A TOKO DORAYAKI
    router.delete('/:id', async(req, res, next) => {
        try{
            const tokoDorayakiID = req.params.id
            
            //delete from MONGODB
            const delRes = await TokoDorayaki.findByIdAndDelete(tokoDorayakiID);
            
            if(!delRes) return res.status(404).json({error: 'toko dorayaki dengan ID tersebut tidak ditemukan'})
            else{
                await StokDorayaki.deleteMany({idTokoDorayaki: delRes["_id"]})
                if(delRes.gambar !== "/assets/toko-dorayaki/default-toko-dorayaki.png")
                    //delete from FILE SYSTEM
                    fs.unlinkSync('.' + delRes.gambar)

                res.status(200).send({success : 'toko dorayaki berhasil dihapus'})
            }

        } catch(err){
            next(err)
        }
    })

    return router
}


module.exports = tokoDorayakiRouter