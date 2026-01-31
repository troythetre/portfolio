const { db } = require("../../firebase");
const { AUTH_CODE_STATUS } = require("../../voopConstants");

exports.useAuthCode = async function (req, res){
    // Check if the request method is PUT
    if (req.method === "PUT"){
        try {
            // Get the auth code from the request body
            const authCode = req.body.authCode;
            // helper function to mark the auth code as used.
            const result = await markAuthCodeAsUnavailable(req, authCode);
            
            res.status(result.statusCode).json({ message: result.message, details: result.details || {} });

        } catch (error) {
            res.status(500).json({ error: 'Error updating auth code to unavailable', details: error });
        }
    }else{
        res.status(405).json({ error: "Method not allowed" });
    }
}

/*
Helper function to mark the auth code as unavailable. Will do following actions:
1. Fetch authCodes data from the database 
and check if the corresponding auth code exists in the database.
2. Check if the auth code is already used, i.e. if the status is 'UNAVAILABLE'
3. Mark the auth code as unavailable.
*/
exports.markAuthCodeAsUnavailable = async function markAuthCodeAsUnavailable(req, authCode){
    try {
        // Query the 'authCodes' collection for the provided authCode
        const querySnapshot = await db.collection("authCodes")
                                      .where("code", "==", authCode)
                                      .get();

        if (querySnapshot.empty) {
            // No document found with the provided authCode
            return ({
                statusCode: 404,
                success: false,
                message: 'Auth code found not found in database.'
            });
        }

        // Assuming authCode is unique and only one document will be returned
        const authCodeDoc = querySnapshot.docs[0];
        const authCodeRef = authCodeDoc.ref;
        const authCodeData = authCodeDoc.data();
        
        // Check if the authCode's status is 'available'
        if(authCodeData.status !== AUTH_CODE_STATUS.AVAILABLE){
            return ({
                statusCode: 401,
                success: false,
                message: 'Auth code is already used.'
            });
        }
        
        //Mark the authCode as unavailable
        await authCodeRef.update({
            usedBy: req.user.email,
            usedAt: new Date(),
            usedFor: req.route.path,
            status: AUTH_CODE_STATUS.UNAVAILABLE
        })
        
        // Get the updated authCode data from the db
        const updatedAuthCode = await authCodeRef.get();
        const updatedAuthCodeData = updatedAuthCode.data();
        

        return({ success: true, statusCode: 200, message: 'Auth code update successfully!', 
        details: {
            code: updatedAuthCodeData.code, createdBy: updatedAuthCodeData.createdBy, createdAt: updatedAuthCodeData.createdAt, usedAt: updatedAuthCodeData.usedAt, usedBy: updatedAuthCodeData.usedBy, usedFor: updatedAuthCodeData.usedFor, status: updatedAuthCodeData.status
        }
        })
    } catch (error) {
        // console.error("Error checking auth code availability:", error);
        return({ success: false, statusCode:500, message: 'Error checking auth code availability.', details: error});
        
    }
}