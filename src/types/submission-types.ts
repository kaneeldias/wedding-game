export type TextSubmissionType = {
    username: string;
    answer: string;
}

export type UploadSubmissionType = {
    username: string;
    file: File;
}

export type SubmissionType = TextSubmissionType | UploadSubmissionType;