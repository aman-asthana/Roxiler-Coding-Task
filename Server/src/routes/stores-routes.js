const router = require('express').Router();

const {getStores, addStore} = require('../controllers/stores-controller')
const auth = require('../middlewares/auth-middleware');
const role = require('../middlewares/role-middleware')

router.get('/', auth, getStores);

//for admin
router.post('/add', auth, role(["ADMIN"]), addStore);

module.exports = router