require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var urls = [];
// Your first API endpoint
app.post('/api/shorturl', (req, res) => {
var url = new URL(req.body.url);
  console.log(url);
  dns.lookup(url.hostname,(err,address) =>{
    if(err) {
      res.json({error: "invalid url"})
    } else {
      if(!urls.includes(url.href)){
        urls.push(url.href);
      }
      res.json({original_url:url.href,short_url:urls.indexOf(url.href)+1});    
    }    
  })
});

app.get("/api/shorturl/:id",(req,res) => {
  if(req.params.id <= urls.length) {
  const redirectUrl = urls[req.params.id - 1];
  res.redirect(redirectUrl);
  } else {
    res.json({error:"invalid id"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
