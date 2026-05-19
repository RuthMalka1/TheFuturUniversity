const express = require('express');
const materialController = require('../controllers/materialController');
const uploadMaterialMiddleware = require('../Middleware/uploadMaterialMiddleware');

const materialRouter = express.Router();

materialRouter.post('/', uploadMaterialMiddleware, materialController.addNewMaterial);
materialRouter.put('/:id',materialController.updateMaterial);
materialRouter.get('/',materialController.getAllMaterials);
materialRouter.get('/:id',materialController.getMaterialByid);
materialRouter.delete('/:id',materialController.deletMaterial)
module.exports = materialRouter;