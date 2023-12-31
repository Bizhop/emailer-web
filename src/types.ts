export type Code = {
    id: number,
    store: string,
    code: string,
    valid: string,
    used: boolean
}

export type Report = {
    emails: ReportEmail[],
    codesRemaining: {
        PG: number,
        NBDG: number
    },
    error?: string
}

export type ReportEmail = {
    to: string,
    store: string,
    code: string,
    sent: string
}

export type Response = {
    email: ResponseEmail | null,
    error: string | null
}

export type ResponseEmail = {
    from: string,
    to: string,
    subject: string,
    timestamp: string | null,
    content: string
}

export type SheetsRequest = {
    id: number,
    timestamp: string | null,
    name: string,
    email: string,
    competitionInfo: string | null,
    store: string,
    competitionDate: string,
    status: string
}
