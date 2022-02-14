const express = require('express')
const { Db } = require('mongodb')
const app = express()
const PORT = 3000

const router = require('./router')

app.set('view engine', 'ejs')
app.set('views', './public/views')
app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(router)
    
//    if(client.isConnected()){
//        const users = await db.collection('users').find().toArray()
//        res.status(200).json(users)
//    } else {
//        res.status(500).json({
//            status: "error",
//            message: "Failed Connection"
//        })
//    }


app.listen(PORT, () => {
    console.log('server berjalan di port '+ PORT )
})