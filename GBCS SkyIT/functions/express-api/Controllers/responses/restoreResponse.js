const { db } = require("../../firebase");

async function restoreResponse(trashID) {
    // Get Trash data
    const trashRef = db.collection("trash").doc(trashID);
    const trashSnapshot = await trashRef.get();

    if (!trashSnapshot.exists) {
        throw new Error("Trash document not found");
    }

    if (trashSnapshot.data().itemType !== "response") {
        throw new Error("itemType is not response in trashID");
    }

    // Get the response id
    const restorationInfo = trashSnapshot.data().restorationInfo;

    const responseID = restorationInfo.responseID;

    // Get the response data
    const responseRef = db.collection("responses").doc(responseID);
    const responseSnapshot = await responseRef.get();

    if (!responseSnapshot.exists) {
        throw new Error("Response not found!");
    }

    // restore response
    await responseRef.update({
        "isDeleted.status": false,
        "isDeleted.deletionDate": null,
        "isDeleted.deletedBy": null,
    });

    // Delete the trash document
    await trashRef.delete();

    return "Response restored successfully!";
}

exports.restoreResponse = async function(req, res) {
    if (req.method === "PUT") {
        try {

            // Get the trashID from the request body
            const { trashID } = req.body;

            const restoreResult = await restoreResponse(trashID);
            res.status(200).json({ message: restoreResult });

            next()
        } catch (error) {
            //console.error("Error handling section restore request:", error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}