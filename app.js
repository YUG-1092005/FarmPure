if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Expert = require("./modules/expert.js");
const User = require("./modules/user.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./errors/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Chat = require("./modules/chat.js");


//Products router
const productsRouter = require("./product routes/product.js");

//Products review router
const productReviewRouter = require("./product routes/productReview.js");

//Experts router
const expertsRouter = require("./expert routes/expert.js");

//Expert review router
const  expertReviewRouter = require("./expert routes/expertReview.js");

//Chat router
const chatRouter = require("./Chat/chat.js");

//User router
const userRouter = require("./user routes/user.js");

//Expert router
const expertRouter = require("./expert routes/expertAuthorization.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "/public")));

//Connected to Atlas
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
};


//Storing session info in Atlas
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

//Checking err in Mongo Store
store.on("error" , () => {
    console.log("Error in Mongo Store: ", error);
});

//Using Session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //Cross platform attacks prevention
    }
};

main() 
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((e) => {
        console.log("Error is: ", e);
    });

app.listen(8080 ,() => {
    console.log("Server listening to the port 8080");
});


//Socket.io 
const io = require("socket.io")(3000 , {
    cors:{
        origin:"http://localhost:8080",
    }
});

// Socket.io connection handling
io.on("connection", (socket) => {
    
    socket.on('authenticate', (userId) => {
        socket.userId = userId; // Store the user ID in the socket object
        console.log("Socket userID: " , userId);
    }); 

    socket.on("start-chat", (expertId , userId) => {
        let roomId = `${userId} - ${expertId}`;
        socket.join(roomId);
    });

    socket.on("send-msg", async (data) => {
        if(socket.userId) {
        let  { message, expertId , userId } = data;
        let roomId = `${userId} - ${expertId}`;

        socket.to(expertId).emit("receive-msg", message); // Emit the message to the receiver

        try {
            let newChat = new Chat({
                message: message,
                sender: userId ,
                receiver: expertId,
            });

            await newChat.save();  // Save the chat message to the database

        } catch (error) {
            console.error("Error saving chat message:", error);
            }
        }
        else {
            console.log('User is not authenticated.');
        }
    });
});

//Using session options and flash
app.use(session(sessionOptions));
app.use(flash());

//Using Passport
app.use(passport.initialize());
app.use(passport.session());

//Local strategies 
passport.use("expert-local", new LocalStrategy(Expert.authenticate()));

passport.use("user-local", new LocalStrategy(User.authenticate()));

//Serialization using passport
passport.serializeUser(async function(user, done) {
    try {
        let data;
        if (user instanceof User) {
            data = { id: user.id, type: 'user' };
        } else if (user instanceof Expert) {
            data = { id: user.id, type: 'expert' };
        } else {
            throw new Error('Unknown user type');
        }
        done(null, data);
    } catch (error) {
        done(error);
    }
});

//Deserialization using passport
passport.deserializeUser(async function(data, done) {
    try {
        let user;
        if (data.type === 'user') {
            user = await User.findById(data.id);
        } else if (data.type === 'expert') {
            user = await Expert.findById(data.id);
        } else {
            throw new Error('Unknown user type');
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
});

//Using local variable
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currUser = req.user;
    next();
});



//Test page
app.get("/" , (req,res) => {
    res.render("./details/home.ejs");
});

//Home page
app.get("/home" , (req,res) => {
    res.render("./details/home.ejs");
});

//Guide page
app.get("/guide" , (req,res) => {
    res.render("./details/guide.ejs");
});

//Schemes page
app.get("/agriculture/schemes" , (req,res) => {
    res.render("./details/schemes.ejs");
});

//Privacy page
app.get("/privacy" , (req,res) => {
    res.render("./details/privacy.ejs");
});

//Terms and Conditions page
app.get("/terms/conditions" , (req,res) => {
    res.render("./details/terms.ejs");
});

//Routes related to products
app.use("/products" , productsRouter);

//Routes related to products review
app.use("/products/:id/review", productReviewRouter);

//Routes related to experts
app.use("/experts" , expertsRouter);

//Routes related to experts review
app.use("/expert/:id/reviews" , expertReviewRouter);

//Route related to chat
app.use("/expert/:id/chat" , chatRouter);

//Expert Authentication and Authorization routes
app.use("/expert" , expertRouter);

//User Authentication and Authorization routes
app.use("/" , userRouter);

//Error handling for some undefined path
app.use("*" , async(req , res , next) => {
    next(new ExpressError(404 , "Page not found"));
});

//Global error handler for handling errors that occur anywhere in the application
app.use((err, req, res, next) => {
    let {statusCode=500 , message="Something Went Wrong!!"} = err;
    res.status(statusCode).render("./products/error.ejs" , {message});
    // res.status(statusCode).send(message);
});



