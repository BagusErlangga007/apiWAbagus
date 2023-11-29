const router = require("express").Router();
const client = require("../whatsapp");
const auth = require("../auth");
const path = require("path");
var moment = require("moment"); // require

const clientIsNotConnected = "Client is not connected";

router.get("/", async (req, res, next) => {
  return res.send({ message: "Ok api is working 🚀" });
});

router.get("/info", async (req, res, next) => {
  if (client.info == null) return res.send({ message: clientIsNotConnected });
  return res.send(client.info);
});

router.get("/getqr", (req, res, next) => {
  res.send({
    message: client.QrCode.result,
    generatedAt: moment(client.QrCode.generatedAt).format("dd MMM YYYY"),
  });
});

router.post("/logout", (req, res) => {
  if (client.info == null) return res.send("Client belum login.");

  client.logout();
  return res.send({ message: "Client Berhasil Logout." });
});

router.post("/sendmessage", async (req, res, next) => {
  if (!auth(req.body.tokens))
    return res.send({
      message: "token salah",
    });

  const { applicant } = req.body; // Get the body
  const { tokens } = req.body;

  for (let i = 0; i < applicant.length; i++) {
    const { number, message } = applicant[i];

    // Kirim pesan menggunakan nomor dan pesan dari setiap elemen array
    const msg = client.sendMessage(`${number}@c.us`, message);

    // Kirim respons jika diperlukan

    console.log(`${number}@c.us`, message);
    // res.send({ msg });
  }

  // });

  res.json({ success: true });
});

module.exports = router;
