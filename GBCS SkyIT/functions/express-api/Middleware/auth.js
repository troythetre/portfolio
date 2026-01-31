// middleware/auth.js
const admin = require("firebase-admin");
const { db } = require("../firebase");
const { USER_ROLES } = require("../voopConstants");
exports.protect = async function(req, res, next) {

    try {

        const bearerToken = req.headers.authorization ?.split(" ")[1];

        if (!bearerToken) {
            return res.status(401).json({ error: "Missing authentication token" });
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(bearerToken);
        req.user = decodedToken; // Attach the user to the request object

        const findUser = await db
            .collection("users")
            .where("email", "==", decodedToken.email)
            .get();

        if (!findUser.empty && findUser.docs[0].data().hasOwnProperty("role")) {
            req.user["role"] = findUser.docs[0].data().role
        }
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ error: "Invalid authentication token" });
    }
};

//this function check if the user is registered
exports.isRegistered =  function async(req, res, next) {
        //check if user has a role thus user is on the db
        if (req.user.hasOwnProperty("role")) {
            next()
        } else {
            res.status(401).json({ error: 'Not authorized: user not found in the database' })
        }
    }


//this function check if the user is admin- it is used on routes to restrict access by user type
exports.isAdmin = function async(req, res, next) {
        //check if user has correct role to accss the route

        console.log(req.user);
        
        if (req.user.role == USER_ROLES.ADMIN) {
            next()
        } else {
            res.status(401).json({ error: 'Not authorized: Only Admins can perform this action' })
        }
    }
