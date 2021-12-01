declare type AlarmCategory = "ddos" | "server failure"

declare type Action = {
    id: number,
    content: string
}

declare type Checklist = {
    uid: number,
    name: string,
    category: AlarmCategory,
    actions: Action[],
    progress: number
}

declare type Alarm = {
    uid: number,
    risk: number,
    source: string,
    checklistId: number,
    message: string
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