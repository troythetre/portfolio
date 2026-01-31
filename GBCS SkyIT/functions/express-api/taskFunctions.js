const { db } = require("./firebase");
const nodemailer = require("nodemailer");

// Configure Nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: "voopskyit@gmail.com",
        pass: "pbidfgskaasevdad",
    },
    tls: {
        rejectUnauthorized: false, // This allows self-signed certificates
    },
});

// Function to send email notification for task
async function sendTaskNotificationEmail(
    userEmail,
    proposalID,
    questionID = "",
    taskType,
    deadLine
) {
    //customized text message for each task type: Review, Approve, Answer
    let textMessage = "";

    if (taskType === "Review") {
        textMessage = `A new review task has been assigned to you for Proposal ${proposalID}, Question ${questionID}. The deadline is ${deadLine}`;
    } else if (taskType === "Approve") {
        textMessage = `A new approve task has been assigned to you for Proposal ${proposalID}. The deadline is ${deadLine}`;
    } else if (taskType === "Answer") {
        textMessage = `A new answer task has been assigned to you for Proposal ${proposalID}, Question ${questionID}. The deadline is ${deadLine}`;
    }

    const mailOptions = {
        from: "voopskyit@gmail.com",
        to: userEmail,
        subject: "New Task Notification",
        text: textMessage,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email notification sent successfully.");
    } catch (error) {
        throw ("Error sending email notification:", error);
    }
}

// Function to add a new answer task for a user, proposal, and question
exports.addAnswerTask = async function(
    userEmail,
    proposalID,
    questionID,
    deadline
) {
    try {
        const taskRef = db.collection("tasks").doc(userEmail);
        const taskSnapshot = await taskRef.get();

        if (!taskSnapshot.exists) {
            await taskRef.set({});
        }

        const userTasks = taskSnapshot.data() || {};
        const proposalTasks = userTasks[proposalID] || {};
        const answerTasks = proposalTasks.answer || [];

        // Check if the question already exists in the answerTasks array
        const existingQuestionIndex = answerTasks.findIndex(
            (task) => task.questionID === questionID
        );

        if (existingQuestionIndex !== -1) {
            // If the question already exists, update only the deadline field
            answerTasks[existingQuestionIndex].deadline = deadline;
        } else {
            // If the question does not exist, add a new question with the given deadline
            answerTasks.push({ questionID, deadline, isCompleted: false });
        }

        await taskRef.set({
            ...userTasks,
            [proposalID]: {...proposalTasks, answer: answerTasks },
        });
        await sendTaskNotificationEmail(
            userEmail,
            proposalID,
            questionID,
            "Answer",
            deadline
        );

        // console.log('Answer task added successfully!');
    } catch (error) {
        throw ("Error adding answer task:", error);
    }
}

// Function to add a new write task for a user, proposal, and question
exports.addReviewTask = async function(
    userEmail,
    proposalID,
    questionID,
    deadline
) {
    try {
        const taskRef = db.collection("tasks").doc(userEmail);
        const taskSnapshot = await taskRef.get();

        if (!taskSnapshot.exists) {
            await taskRef.set({});
        }

        const userTasks = taskSnapshot.data() || {};
        const proposalTasks = userTasks[proposalID] || {};
        const reviewTasks = proposalTasks.review || [];

        // Check if the question already exists in the reviewTasks array
        const existingQuestionIndex = reviewTasks.findIndex(
            (task) => task.questionID === questionID
        );

        if (existingQuestionIndex !== -1) {
            // If the question already exists, update only the deadline field
            reviewTasks[existingQuestionIndex].deadline = deadline;
        } else {
            // If the question does not exist, add a new question with the given deadline
            reviewTasks.push({ questionID, deadline, isCompleted: false });
        }

        await taskRef.set({
            ...userTasks,
            [proposalID]: {...proposalTasks, review: reviewTasks },
        });
        await sendTaskNotificationEmail(
            userEmail,
            proposalID,
            questionID,
            "Review",
            deadline
        );
    } catch (error) {
        throw ("Error adding review task:", error);
    }
}

// Function to add a new approve task for a user and proposal
exports.addApproveProposalTask = async function(
    userEmail,
    proposalID,
    deadline,
    description
) {
    try {
        const taskRef = db.collection("tasks").doc(userEmail);
        const taskSnapshot = await taskRef.get();

        if (!taskSnapshot.exists) {
            await taskRef.set({});
        }

        const userTasks = taskSnapshot.data() || {};
        const proposalTasks = userTasks[proposalID] || {};
        const approveTask = proposalTasks.approve || {};
        const approveProposalTask = {
            proposalID,
            deadline,
            description,
            isCompleted: false,
        };

        await taskRef.set({
            ...userTasks,
            [proposalID]: {
                ...proposalTasks,
                approve: {...approveTask, proposal: approveProposalTask },
            },
        });
        //call function to send email notification
        await sendTaskNotificationEmail(
            userEmail,
            proposalID,
            "",
            "Approve",
            deadline
        );
    } catch (error) {
        throw ("Error adding approve task:", error);
    }
}