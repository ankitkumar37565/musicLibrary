require('dotenv').config();
const express = require('express');
const app = express()
const router = require('./routers/route')
const port = 3000;
app.use(express.json());
app.use('/api/v1',router);
let response =require('./response');
app.use((err,req,res,next)=>{
    console.log(err)
    return response[400](res); 
})
app.listen(port,()=>{
    console.log('APP listening on port :',port)
});
