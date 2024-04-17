const Expert = require("../modules/expert.js");

//Controller for signup form
module.exports.expertSignupForm =  (req,res) => {
    
    //Checking role and restricting usage of some pages
    if(req.user.role == "Expert") {
        req.flash("failure" , "You are already registered as an expert");
        res.redirect("/experts");
    }
    else {
        res.render("./experts/expertRegistration.ejs");
    }
};

//Controller for saving expert
module.exports.expert = async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        let { email, username, password, name, profession, about, organization, experience } = req.body.expert;
        
        // Create a new Expert instance
        let newExpert = new Expert({ 
            email, 
            username, 
            profession, 
            about, 
            organization, 
            experience, 
            name, 
            img: { url, filename } 
        });

        let registeredExpert = await Expert.register(newExpert, password);

        await registeredExpert.save();

        req.login(registeredExpert, (err) => {
            if (err) {
                req.flash("failure", "Error logging in after registration");
                return res.redirect("/expert/authenticate");
            }
            req.flash("success", `Hello ${username} Welcome to Farmpure`);
            res.redirect("/experts");
        });
    } catch (error) {
        req.flash("failure", error.message);
        res.redirect("/expert/registration");
    }
};

//Controller for login form
module.exports.expertLoginForm = (req,res) => {
    res.render("./experts/expertAuthenticate.ejs");
};

//Controller for login
module.exports.expertLogin = async (req, res) => {
    console.log(req.user);
    req.flash("success", "Welcome to Farmpure");
    let redirectUrl = res.locals.redirectUrl || "/experts";
    res.redirect(redirectUrl);
};