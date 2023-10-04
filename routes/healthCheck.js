const express = require('express');
const router = express.Router();
const {checkHealth, rejectOtherMethods} = require('../controller/healthCheckController.js');



router.get('/', checkHealth);

router.all('/', rejectOtherMethods);

/*export default (healthapp) => {
    app.use('/healthz', )
}*/

module.exports = router;