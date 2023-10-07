import { Router } from "express";
// import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload } from "../../utils/multer.js";
import * as validators from "./beach.validation.js";

import * as controllers from '../Beach/beach.controller.js'
import { validation } from "../../utils/validation.js";
// import { validation } from "../../utils/validation.js";

const router = Router()

router.post('/addBeach',fileUpload({}).array('photo') ,controllers.addBeach )
router.post('/search',controllers.searchBeach )


// router.get('/test', asyncHandler(controllers.test) )
export default router
