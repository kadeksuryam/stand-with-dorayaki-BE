const dorayakiRouter = (redisClient) => {
    const Dorayaki = require('../models/dorayaki')
    const router = require('express').Router()
    const path = require('path')
    const { v4: uuidv4 } = require('uuid')
    const fs = require('fs')

    //CREATE
    const multer = require('multer')
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname,'../assets/dorayaki/'))
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
            const { rasa, deskripsi } = req.body

            const newDorayaki = new Dorayaki({
                rasa, deskripsi, gambar : `/assets/dorayaki/${req.fileName}`
            })
    
            const savedDorayaki = await newDorayaki.save()
    
            res.status(201).json(savedDorayaki)
        } catch(error){
            next(error)
        }
    })

    //READ ALL DORAYAKI
    router.get('/', async(req, res, next) => {
        try{
            const dorayakis = await Dorayaki.find({})
            return res.status(200).json(dorayakis)
        }catch(err){
            next(err);
        }
    })

    //READ A DORAYAKI
    router.get('/:id', async(req, res, next) => {
        try{
            const dorayakiID = req.params.id
            const dorayaki = await Dorayaki.findById(dorayakiID)
            
            if(!dorayaki) return res.status(404).json({error: 'dorayaki dengan ID tersebut tidak ditemukan'})
            else return res.status(200).json(dorayaki)
        } catch(err){
            next(err)
        }
    })

    //UPDATE A DORAYAKI
    router.put('/:id', upload.single('gambar'), async(req, res, next) => {
        try{
            const dorayakiID = req.params.id
            const { rasa, deskripsi } = req.body

            const dataUpdate = {}
            if(rasa) dataUpdate["rasa"] = rasa
            if(deskripsi) dataUpdate["deskripsi"] = deskripsi
            if(req.fileName) dataUpdate["gambar"] = `/assets/dorayaki/${req.fileName}`

            const updatedDorayaki = await Dorayaki.findByIdAndUpdate(dorayakiID, dataUpdate, {new: true})

            if(!updatedDorayaki) return res.status(404).json({error: 'dorayaki dengan ID tersebut tidak ditemukan'})
            else return res.status(200).json(updatedDorayaki)
            
        } catch(err){
            next(err)
        }
    })

    //DELETE A DORAYAKI
    router.delete('/:id', async(req, res, next) => {
        try{
            const dorayakiID = req.params.id
            
            //delete from MONGODB
            const delRes = await Dorayaki.findByIdAndDelete(dorayakiID);
            
            if(!delRes) return res.status(404).json({error: 'dorayaki dengan ID tersebut tidak ditemukan'})
            else{
                //delete from FILE SYSTEM
                fs.unlinkSync('.' + delRes.gambar)

                res.status(200).send({success : 'dorayaki berhasil dihapus'})
            }

        } catch(err){
            next(err)
        }
    })

    return router
}


module.exports = dorayakiRouter