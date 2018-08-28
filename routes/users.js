var express = require('express');
var router = express.Router();
var userController = require('../controllers/usersController')
const IsLoggedIn = require('../middlewares/isLoggedIn')
const UserCheck = require('../middlewares/userCheck')
const images = require('../helpers/images')

/* GET user page. */
router.get('/', userController.getUsers);
router.get('/:id', userController.getOneUser);
router.post('/', userController.registerUser);
router.put('/:id', IsLoggedIn.loginCheck, UserCheck.isUser, userController.updateUser);
router.put('/:id/password', IsLoggedIn.loginCheck, UserCheck.isUser, userController.updatePassword);
router.put('/:id/image', images.multer.single('image'), images.sendUploadToGCS, userController.updateImage)
router.delete('/:id', IsLoggedIn.loginCheck, UserCheck.isUser, userController.deleteUser);

module.exports = router;
