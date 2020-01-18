let express = require("express");
let app = express();
let port = process.env.NODE_ENV || 4800
app.use(express.json());
let Joi = require("@hapi/joi");

let songs = [
    {id:1, name:"Mast Magan", singer:"Arjit Singh", duration:"5.09", price:"$25"},
    {id:2, name:"Channa Mereya", singer:"Arjit Singh", duration:"3.29", price:"$29"},
    {id:3, name:"Kabira", singer:"Arjit Singh", duration:"6.00", price:"$35"},
    {id:4, name:"Rabbta", singer:"Arjit Singh", duration:"4.19", price:"$45"},
    {id:5, name:"Tum Ho", singer:"Arjit Singh", duration:"5.29", price:"$20"},
    {id:6, name:"Ghungroo", singer:"Arjit Singh", duration:"4.49", price:"$35"},
];

//all songs
app.get("/api/songs", (req,res) => {
    res.send(songs);
});

//song by id
app.get("/api/song/:id", (req,res) =>{
    let song = songs.find(item => item.id === parseInt(req.params.id));
    if(!song) {return res.status(404).send({message:"Invalid song id"})};
    // let {id,name,singer,duration,Price} = song;
    // res.send(name);
    res.send(song.name);
});

//add new song
app.post("/api/song/createsong", (req,res) => {
    let {error} = Validation(req.body);
    if(error){return res.send(error.details[0].message)};

    let song = {
        id: songs.length + 1,
        name: req.body.name,
        singer: req.body.singer,
        duration: req.body.duration,
        price: req.body.price
    };
    songs.push(song);
    res.send(songs);
});

//update song
app.put("/api/song/updatesong/:id", (req,res) => {
    //find by id
    let song = songs.find(item => item.id === parseInt(req.params.id));
    if(!song) {return res.status(404).send({message:"Invalid song id"})};
    //joi schema
    let {error} = Validation(req.body);
    if(error){return res.send(error.details[0].message)};
    //update song
    song.name = req.body.name;
    song.singer = req.body.singer;
    song.duration = req.body.duration;
    song.price = req.body.price;
    res.send(songs);
});

//remove song
app.delete("/api/song/deletesong/:id", (req,res) => {
    //find by id
    let song = songs.find(item => item.id === parseInt(req.params.id));
    if(!song) {return res.status(404).send({message:"Invalid song id"})};
    let index = songs.indexOf(song);
    songs.splice(index, 1);
    res.send({message: "Removed the song", s: songs});
});


function Validation(error){
    let Schema = Joi.object({
        name: Joi.string().min(4).max(100).required(),
        singer: Joi.string().min(3).max(100).required(),
        duration: Joi.number().required(),
        price: Joi.string().required()
    });
    return Schema.validate(error);
}

app.listen(port, () => {console.log(`port working on ${port}`)});
