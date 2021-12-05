declare type ActionType = {
    uid: number,
    name?: string,
    function?: string,
    responsiblePerson?: string,
    info?: string
}

declare type Source = "DDOS-Detector" | "AccountBruteforceChecker" | "flightplanChecker" | "OverloadModule" | "RadarChecker" | "TerminalForwarder"

declare type Checklist = {
    uid: number,
    name: string,
    source: Source,
    actions?: Action[]
}

declare type Alarm = {
    uid: number,
    risk: number,
    api: string,
    source: Source,
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