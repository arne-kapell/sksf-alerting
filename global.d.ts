declare type AlarmCategory = "ddos" | "server failure"

declare type System = {
    uid: String,
    name: String,
    location?: String
}

declare type Alarm = {
    uid: String,
    category: AlarmCategory[],
    date: Date,
    risk: Number,
    systems?: System[],
    checklist?: Checklist
}

declare type Action = {
    id: Number,
    content: String,
    done?: Boolean
}

declare type User = {
    uid: String,
    name: String,
    mail?: String,
    pwd_hash: String,
    group_id: Number
}

declare type Checklist = {
    id: Number,
    category: Alarm_Category,
    actions: Action[]
}