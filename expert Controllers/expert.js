const Expert = require("../modules/expert.js");

//Controller for showing experts
module.exports.experts = async(req,res) => {
    let allExperts = await Expert.find({});
    res.render("./experts/expert.ejs", {allExperts});
};

//Controller for showing particular expert
module.exports.showExpert = async(req,res) => {
    let {id} =req.params;
    let expert = await Expert.findById(id)
    //Populating review along with created by
    .populate({
        path: "review",
       populate: {
            path: "createdBy",
        },
    })
    if(!expert) {
        req.flash("failure" , "Expert you are searching for is currently unavailable");
        res.redirect("/experts");
    }
    res.render("./experts/showExpert.ejs",{expert});
};

//Controller for edit form
module.exports.showEditForm = async (req,res) => {
    let {id} = req.params;
    let expert = await Expert.findById(id);
    if(!expert) {
        req.flash("failure" , "Expert you are trying to search is currently not available");
        res.redirect("/experts");
    }

    let originalExpertUrl = expert.img.url;
    res.render("./experts/expertEdit.ejs" , {expert , originalExpertUrl});
};

//Controller for editing expert
module.exports.editExpert = async (req,res) => {
    let {id} = req.params;

    let expert = await Expert.findByIdAndUpdate(id , {...req.body.expert});

    if(typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        expert.img = {url , filename};
        await expert.save();
    }

    req.flash("success" , "Your profile edited successfully!");
    res.redirect(`/experts/${id}`);
};

//Controller for deleting expert
module.exports.deleteExpert = async(req,res) => {
    let {id} = req.params;
    let expert = await Expert.findById(id);
    if (!expert || !req.user || !req.user._id.equals(expert._id)) {
        req.flash("failure" , "You don't have access to delete this profile");
        return res.redirect(`/experts/${id}`);
    }
    await Expert.findByIdAndDelete(id);
    req.flash("success" , "Your profile deleted successfully");
    res.redirect("/experts");
};
