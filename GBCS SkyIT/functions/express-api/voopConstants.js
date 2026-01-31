exports.PROPOSAL_STATUS = {
  UPDATE: "changes_required",
  APPROVED: "approved",
  REJECTED: "rejected",
  REVIEW: "under review",
  INPROGRESS: "in progress",
};

exports.QUESTION_STATUS = {
  UPDATE: "changes requested",
  APPROVED: "approved",
  REJECTED: "rejected",
  REQUEST_REVIEW: "request for review",
  REVIEW: "under review",
  INPROGRESS: "in progress",
};

exports.PROPOSAL_TYPE = {
  DIGITAL: "digital",
  PAPER: "paper",
};

exports.PROPOSAL_CONTENT = {
    QUESTIONS: "questions",
    MEDIA_FILES: "mediaFiles",
    COLORS: "colors",
    PAGES: "pages",
    SECTIONS: "sections",
    CLIENT_LOGO: "clientLogo"
};

exports.OPERATION_TYPE = {
    ADD: "add",
    EDIT: "edit",
    DELETE: "delete",
    ARCHIVE: "archive",
    RESTORE: "restore",
    ASSIGN: "assigned",
    COMMENT: "comment",
    CREATE: "created"
}

exports.DEFAULT_DUE_DATES = {
  PPOPOSAL_DUE: 15,
  PROPOSAL_APPROVAL: 2,
  QUESTION_WRITE: 1,
  QUESTION_REVIEW: 2,
};

exports.USER_ROLES = {
    ADMIN: "admin",
    USER: "user",
};

exports.AUTH_CODE_STATUS = {
    AVAILABLE: "available",
    UNAVAILABLE: "unavailable",
}
