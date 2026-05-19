const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

usersRouter.post('/',usersController.addNewUser);
usersRouter.post('/login', usersController.loginUser);
usersRouter.post('/reset-password', usersController.resetPasswordByPhone);
usersRouter.put('/:id',usersController.updateUser);
usersRouter.get('/management/list', usersController.getManagementUsersList);
usersRouter.get('/',usersController.getAllUsers);
usersRouter.get('/:id',usersController.getUserByid);
usersRouter.delete('/:id',usersController.deletUser)
module.exports = usersRouter;