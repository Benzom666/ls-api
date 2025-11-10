const express = require("express");
const router = express.Router();
const filesCtrl = require("../controllers/v1/files");

router.post("/upload", filesCtrl.uploadFiles);

module.exports = router;
