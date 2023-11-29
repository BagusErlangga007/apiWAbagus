const { Client, LocalAuth } = require("whatsapp-web.js");

// This line for print qr to terminal
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

// Tambah custom object QrCode
client.QrCode = {
  qr: "",
  generatedAt: Date.now(),
};

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  qrcode.generate(qr, { small: true }); // This line for print qr to terminal
  client.QrCodes.qr = qr;
  client.QrCode.generatedAt = Date.now();
});

client.on("authenticated", (session) => {
  console.log("AUTHENTICATED", session);
  // sessionCfg = session;
  // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.on("disconnected", (reason) => {
  // Destroy and reinitialize the client when disconnected
  client.destroy();
  client.initialize();

  console.log(reason);
});

module.exports = client;
