const User = require("../modules/user.js");

//Controller for signup form
module.exports.signupForm = (req,res) => {
    res.render("./users/user.ejs");
};

//Controller for user
module.exports.user = async(req,res) => {
    try{
        let {email,username,password } = req.body;
        let newUser = new User({email,username});
        let registerUser = await User.register(newUser , password);
        console.log(registerUser);

        req.login(registerUser , (err) => {
            if(err) {
                return next(err);
            }
                req.flash("success" , `Hello ${username} Welcome to Farmpure`);
                res.redirect("/products");
        })
    }
    catch(e) {
        req.flash("failure" , e.message);
        res.redirect("/signup");
    }
};

//Controller for login form
module.exports.loginForm =  (req,res) => {
    res.render("./users/login.ejs");
};

//Controller for user login
module.exports.userLogin = async (req, res) => {
    req.flash("success", "Welcome to Farmpure");
    let redirectUrl = res.locals.redirectUrl || "/products";
    res.redirect(redirectUrl); // Redirect to the routerropriate URL
};

//Controller for logout
module.exports.logout = (req,res,next) => {
    req.logout((err) => {1
        if(err) {
            return next(err)
        }
            req.flash("success" , "You are now logged out from Farmpure");
            res.redirect("/products");
    })
};