const sharp = require("sharp");
const fs = require("fs");
const { pipeline } = require("stream");

const images = fs.readdirSync("./assets/images/hoho/");

console.log(images[0]);

const content = fs.readFileSync(`./assets/images/hoho/${images[0]}`, {encoding: 'base64'});
const buffImg = new Buffer.from(content, "utf-8");



const transformer = (w) => sharp().resize(w)

pipeline(buffImg, transformer(500), 
    (data)=>{
        console.log(data);
    }, 
    (err) => {
        console.log("======================에러 발생========================");
        console.log(err);
    })




