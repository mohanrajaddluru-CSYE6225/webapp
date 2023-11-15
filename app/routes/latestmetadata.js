const express = require('express');
const router = express.Router();
const fetchlatestmetadata = require('../controller/metadata.js');

router.get('/*', fetchlatestmetadata);

module.exports = router;
