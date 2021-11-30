declare type AlarmCategory = "ddos" | "server failure"

declare type Source = {
    uid: string,
    name: string,
    location?: string
}

declare type Action = {
    id: number,
    content: string,
    done?: boolean
}

declare type Checklist = {
    id: number,
    category: AlarmCategory,
    actions: Action[]
}

declare type Risk = "low" | "medium" | "high"

declare type Alarm = {
    uid: string,
    category: AlarmCategory,
    datetime: Date,
    risk: Risk,
    source: Source,
    checklist?: Checklist
}

declare type User = {
    uid: number,
    name?: string,
    mail: string,
    pwdHash: string,
    groupId: number
}


declare type UiUser = {
    uid: number,
    name?: string,
    mail: string,
    groupId: number
}