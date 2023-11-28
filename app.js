const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs'); // Add this line
require('dotenv').config();



const app = express(); // Add this line
const SESSION_FILE_PATH = './session.json';
let sessionCfgs;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfgs = require(SESSION_FILE_PATH);
}
app.use(express.json());
let client = new Client({
  authStrategy: new LocalAuth(),
});


// Add this after express code but before starting the server

function authorization(tokens){
  if (tokens == "yuhu"){
    // handling true
    return true;
  }
  
  //handling false
  return false;
}

client.on('qr', qr => {
  // NOTE: This event will not be fired if a session is specified.
  console.log('QR RECEIVED', qr);
  app.get('/getqr', (req, res, next) => {
   if(  authorization(req.body.tokens))
   {
     res.send({ qr });
   } else{
    res.send({
      message:"token salah",
    });
   }
  });
});

client.on('authenticated', session => {
  console.log('AUTHENTICATED', session);
  // sessionCfg = session;
  // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
});
 
client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessfull
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('READY');
});

// Listening for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`)); //diganti wa.mediainovasi.id

client.initialize();

client.on('disconnected', (reason) => {
  // Destroy and reinitialize the client when disconnected
  client.destroy();
  client.initialize();

  console.log(reason);
});
const qrcode = require('qrcode-terminal');
const { log } = require('console');
const schedule = require("node-schedule");

client.on('qr', qr => {
  // NOTE: This event will not be fired if a session is specified.
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true }); // Add this line
  app.get('/getqr', (req, res, next) => {
    res.send({ qr });
  });
});


app.post('/logout',(req,res)=>{
  if(client.info != undefined){
      // 
      // client = new Client({
      //     authStrategy : new NoAuth()
      // });

      // client = new Client({
      //   authStrategy: new LocalAuth(),
      // }); 
       
      
      client.logout();
      // client.destroy();

      res.send({message : "Client Berhasil Logout."});
      // client = new Client({
      //   authStrategy: new LocalAuth(),
      // });

      // client.initialize();

  }else{
      res.send("Client belum login.")
  }
})

app.post('/sendmessage', async (req, res, next) => {
  try {
    if(  authorization(req.body.tokens))
    {
      const {applicant} = req.body; // Get the body

      const {tokens} = req.body
      // var j = schedule.scheduleJob("01 24 09 * * *", function () {
        if(tokens=="yuhu")
        {
          for (let i = 0; i < applicant.length; i++) {
            const { number, message } = applicant[i];
      
            // Kirim pesan menggunakan nomor dan pesan dari setiap elemen array
            const msg = client.sendMessage(`${number}@c.us`, message);
      
            
            // Kirim respons jika diperlukan
      
            console.log(`${number}@c.us`, message);
            // res.send({ msg });
      
          }
        }
        
      // });
  
  
     
      res.json({ success: true });
   } else{
    res.send({
      message:"token salah",
    });
   }   
  } catch (error) {
    next(error);
  }
});
app.get('/info', async (req, res, next) => {
  try {
    console.log(client.info);
    res.send(client.info);
  } catch (error) {
    next(error);
  }
});

