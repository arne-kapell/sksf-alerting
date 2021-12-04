declare type AlarmCategory = "ddos" | "server failure"

declare type ActionType = {
    uid: number,
    content: string
}

declare type Checklist = {
    uid: number,
    name: string,
    source: string,
    actions?: Action[],
    progress: number
}

declare type Alarm = {
    uid: number,
    api: string,
    risk: number,
    source: string,
    checklistId: number,
    message: string,
    datetime: Date
}

declare type User = {
    uid: number,
    name?: string,
    mail: string,
    pwdHash?: string,
    privileged: boolean
}

declare type Role = {
    uid: number,
    name: string,
    privileged: boolean
}

declare type UiUser = {
    uid: number,
    name?: string,
    mail: string,
    groupId: number
}