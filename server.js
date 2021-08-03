const express = require('express');
const axios = require('axios');
const server = express();
const cors = require('cors');
require('dotenv').config();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exam', { useNewUrlParser: true, useUnifiedTopology: true });

class Color {
    constructor(data) {
        this.title = data.title;
        this.imageUrl = data.imageUrl;
    }
}
const colorSchema = mongoose.Schema({
    title: String,
    imageUrl:String
})
const userSchema = mongoose.Schema({
    email: String,
    colorData: [],
})
const userModel = mongoose.model('favcolor', userSchema);

const userSeed = () => {
    const user = new userModel({
        email: 'wijdankhaled178@gmail.com',
        colorData: [{
            title: "orange",
            imageUrl: "http://www.colourlovers.com/img/000000/100/100/Black.png",
        }]

    })
    const user1 = new userModel({
        email: 'quraanrazan282@gmail.com',
        colorData: [{
            title: "red",
            imageUrl: "http://www.colourlovers.com/img/FBB829/100/100/heart_of_gold.png",
        }]

    })
    user.save();
    user1.save();
}
userSeed();
const apiData = async (req, res) => {
    const url = 'https://ltuc-asac-api.herokuapp.com/allColorData';
    await axios.get(url).then(responce => {
        let allData = responce.data.map(el => {
            return new Color(el);
        })
        res.send(allData);
    })
}
server.get('/apidata', apiData);

const getFunction = async (req, res) => {
    const email = req.query.email;
    userModel.finfdOne({ email: email }, (err, data) => {
        if (err) {

        } else {
            res.send(data);
        }
    });

}
server.get('/userdata', getFunction);

// delet function
const deleteFunction = async (req, res) => {
    const email = req.query.email;
    const favid = req.params.id;
    userModel.finfdOne({ email: email }, (err, data) => {
        if (err) {
            res.send('Errore');
        } else {
            let newArray = [];
            data.colorData.forEach((el, idx) => {
                if (idx !== Number(favid)) {
                    newArray.push(el);
                }
            });
            data.colorData = newArray;
            data.save();
            res.send(data.colorData);
        }
    })
}
server.delete('/delete/:id', deleteFunction);

//add 
const PostFunction = async (req, res) => {
    const email = req.query.email;
    const { title, imageUrl } = req.body;
    userModel.finfdOne({ email: email }, (err, data) => {
        if (err) {
            res.send('something wrong', err)
        } else {
            data.colorData.push({
                title: title,
                imageUrl: imageUrl,
            });
            data.save();
            res.send(data.colorData);
        }
    })
}
server.post('/addtofav', PostFunction);
//update
const updateFunction=async(req,res)=>{
    const email=req.query.email;
    const { title, imageUrl } = req.body;
    const favid = req.params.id;
  userModel.finfdOne({email:email},(err,data)=>{
      if(err){

      }else{
          data.colorData.cplice(favid,1,({
              title:title,
              imageUrl:imageUrl,
          }))
          data.save();
          res.send(data.colorData);
      }
  })
}
server.put('/update/:id',updateFunction);

server.listen(PORT,()=>{
    console.log(`iam listen on port ${PORT}`);
})