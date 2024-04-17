const express = require("express");
const router = express.Router();
const {isExpertLoggedIn, isLoggedIn, validateExpert}= require("../middleware.js");
const wrapAsync = require("../errors/wrapAsync.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//Checking user type
const checkUserType = (req,res,next) => {
    if(req.isAuthenticated()) {
        if(req.user.isExpert) {
            return isExpertLoggedIn(req,res,next);
        }
        else {
            return isLoggedIn(req,res,next);
        }
    }else {
            res.redirect("/login");
    }
};

const expertController = require("../expert Controllers/expert.js");

//Displaying all experts
router.get("/" , wrapAsync(expertController.experts));


//Displaying edit form 
router.get("/:id/edit" ,checkUserType, wrapAsync(expertController.showEditForm));

router
    .route("/:id")
    .get(wrapAsync(expertController.showExpert)) //Showing info of experts
    .put(upload.single('expert[img]'),validateExpert,checkUserType,wrapAsync(expertController.editExpert)) //Editing particular expert
    .delete(wrapAsync(expertController.deleteExpert)); //Deleting expert 

module.exports = router;