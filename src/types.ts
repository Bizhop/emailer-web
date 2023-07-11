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

type ReportEmail = {
    to: string,
    store: string,
    code: string,
    sent: string
}

export type Response = {
    email: ResponseEmail | null,
    error: string | null
}

type ResponseEmail = {
    from: string,
    to: string,
    subject: string,
    timestamp: string | null,
    content: string
}
