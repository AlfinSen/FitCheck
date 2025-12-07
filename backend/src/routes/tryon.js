const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { tryOn } = require('../controllers/tryonController');

router.post('/', upload.single('userImage'), tryOn);

module.exports = router;
