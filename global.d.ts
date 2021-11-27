declare type AlarmCategory = "ddos" | "server failure"

declare type System = {
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

declare type Alarm = {
    uid: string,
    category: AlarmCategory[],
    date: Date,
    risk: number,
    systems?: System[],
    checklist?: Checklist
}

declare type User = {
    uid: string,
    name: string,
    mail?: string,
    pwdHash: string,
    groupId: number
}
