declare type ActionType = {
    uid: number,
    name: string,
    function: string, // category?
    responsiblePerson?: string,
    info?: string
}

declare type Checklist = {
    uid: number,
    name: string,
    source: string,
    actions?: Action[]
}

declare type Alarm = {
    uid: number,
    risk: number,
    api: string,
    source: string,
    checklistId: number,
    progress: number,
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