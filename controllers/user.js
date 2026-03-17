const User = require("../models/user.js");




module.exports.renderSignUpForm =(req, res)=>{
    res.render("users/signup.ejs");
} 

module.exports.signUp = async(req, res)=>{
     try{let {username, password, email} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register( newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })
        console.log(registeredUser);
            }catch(e){
                req.flash("error", e.message);
                res.redirect("/signup");
            }
        } 

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req, res)=>{
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
});
}