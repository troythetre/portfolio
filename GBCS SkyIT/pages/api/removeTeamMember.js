import { db, decodeToken, verifyToken } from "./firebase";

export default async function handler(req, res) {
    // put request to update proposal
    if (req.method === "PUT") {
        try {
            const bearerToken = req.headers.authorization?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

                const decodedToken = await decodeToken(bearerToken);

                if (!decodedToken || !decodedToken.email) {
                    res.status(401).json({ error: "Invalid authentication token" });
                    return;
                  }
             
                const { proposalID, userEmail } = req.body;

                //attempt to the appover user on db
                const findUser = await db
                    .collection("users")
                    .where("email", "==", decodedToken.email)
                    .get();

                if (!findUser.empty) {
                    // Assuming email is unique, get the user data
                    const userRecord = findUser.docs[0].data();

                    //check if the user is an admin
                    if (
                        userRecord.hasOwnProperty("role") &&
                        userRecord.role === "admin") {
                        // Retrieve the existing proposal document
                        const proposalSnapshot = await db
                            .collection("proposals")
                            .doc(proposalID)
                            .get();

                        

                        // Check if the proposal document exists
                        if (!proposalSnapshot.exists) {
                            res.status(404).json({ message: "Proposal not found!" });
                            return;
                        }
                        const existingProposal = proposalSnapshot.data();

                        // Check if the proposal document has been deleted
                        if (existingProposal.isDeleted.status) {
                            res.status(500).json({ message: "Proposal has been deleted" });
                            return;
                        }

                        //get registered user emails
                        const registeredUsers = await db.collection('users').get();
                        const registeredUserEmails = [];

                        registeredUsers.forEach((doc)=> {
                            const user = doc.data().email;
                            registeredUserEmails.push(user);
                        })

                        //check if user is registered in database
                        const emailAddress = userEmail;
                        if(!registeredUserEmails.includes(emailAddress)) {
                            res.status(401).json({ error: "User not registered in database"})
                            return;
                        }

                        //find index for team member
                        const index = existingProposal.teamMembers.findIndex(object => {
                            return object.userEmail === userEmail;
                        });


                        //check to make sure user was a team member and if so delete team member
                        if(index === -1) {
                            res.status(400).json({ error: "User isn't a team member of current proposal "});
                            return;
                        } else {
                            existingProposal.teamMembers.splice(index,1);
                        }
        
                        //update proposal with new team members 
                        await proposalSnapshot.ref.update({ teamMembers: existingProposal.teamMembers });

                        //return success message 
                        res.status(200).json({ message: "Team member successfully deleted" });
                        return;
                       
                    } else {
                        res
                            .status(400)
                            .json({ error: "Only Admins can delete team members" });
                        return;
                    }
                } else {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
            
        } catch (error) {
            console.error("Error deleting team member:", error);
            res.status(500).json({ error: "Error deleting team members" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
