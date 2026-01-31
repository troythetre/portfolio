const admin = require("firebase-admin");
const { db } = require("../firebase");
const { USER_ROLES } = require("../voopConstants");

exports.historyLog = async function(req, res, next) {
    const { proposalID, actionType, details } = req.log;

    try {
        const historyLogRef = db.collection("historyLog").doc(proposalID);
        const historyLogSnapshot = await historyLogRef.get();

        if (!historyLogSnapshot.exists) {
            await historyLogRef.set({ entries: [] });
        }

        const logs = historyLogSnapshot.data() || { entries: [] };
        const logEntry = {
            actionType,
            details: details,
            actionDate: new Date(), // Use the current date and time
            performedBy: req.user.email,
        };

        // Append the new history log entry to the existing entries array
        logs.entries.push(logEntry);

        // Update the historyLog collection with the new entries
        await historyLogRef.update({
            entries: logs.entries,
        });

        next();
    } catch (error) {
        console.error("Error adding history log entry:", error);
        // Handle the error appropriately here
    }
};