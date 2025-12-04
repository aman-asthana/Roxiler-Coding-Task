const router = require('express').Router();
const {addRating, updateRating} = require('../controllers/ratings-controller')
const auth = require('../middlewares/auth-middleware');

router.post('/:storeId', auth, addRating)


router.put('/:storeId', auth, updateRating)

module.exports = router