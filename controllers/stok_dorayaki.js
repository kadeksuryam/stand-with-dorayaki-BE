const stokDorayakiRouter = (redisClient) => {
    const StokDorayaki = require('../models/stok_dorayaki')
    const router = require('express').Router()

    //GET STOK BY Query
    router.get('/', async (req, res, next) => {
        try{
            let query={}
            const {idDorayaki, idToko } = req.query
            if(idDorayaki) query.dorayaki = idDorayaki
            if(idToko) query.tokoDorayaki = idToko

            const stokToko = (await StokDorayaki.find(query).populate('dorayaki'))
            
            res.status(200).json(stokToko)
        } catch(err){
            next(err)
        }
    })

    //Update a Stok
    router.put('/:id', async (req, res, next) => {
        try{
            const idStok = req.params.id
            const { stok } = req.body
            
            if(stok < 0) return next(new Error("jumlah stok haruslah positif"))
            else{
                const updatedStok = (await StokDorayaki.findByIdAndUpdate(idStok, {stok}, {new: true}).populate('dorayaki'))
                res.status(200).json(updatedStok)
            }
        } catch(err){
            next(err)
        }
    })

    //Move one Stok to other Stok
    router.put('/:idStok1/:idStok2', async(req, res, next) => {
        try{
            const {deltaStok} = req.body
            const {idStok1, idStok2} = req.params
            
            const firstStok = await StokDorayaki.findById(idStok1)

            if(firstStok["stok"]-deltaStok < 0) return next(new Error("jumlah stok setelah dikurangkan haruslah positif"))
            else{
                await StokDorayaki.findByIdAndUpdate(idStok1, {$inc: {stok: -deltaStok}})
                await StokDorayaki.findByIdAndUpdate(idStok2, {$inc: {stok: deltaStok}})
    
                return res.status(200).json({success: 'stok berhasil dipindahkan'})
            }
        } catch(err){
            next(err)
        }
    })

    return router
}


module.exports = stokDorayakiRouter