import React, { useState } from "react"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import { Report } from "./types"
import { client } from "./api"

export default () => {
    const [dateFrom, setDateFrom] = useState(getFirstDayOfMonth())
    const [dateTo, setDateTo] = useState(getLastDayOfMonth())
    const [report, setReport] = useState<Report | null>(null)

    const getReport = () => {
        client.get("/report", {
            params: {
                "from": simpleDate(dateFrom),
                "to": simpleDate(dateTo)
            }
        })
            .then(response => setReport(response.data))
            .catch(console.error)
    }

    return (
        <div>
            <h1>Report</h1>
            <div>
                <DatePicker dateFormat="yyyy-MM-dd" selected={dateFrom} onChange={setDateFrom} />
                <DatePicker dateFormat="yyyy-MM-dd" selected={dateTo} onChange={setDateTo} />
            </div>
            <button onClick={() => getReport()}>Get report</button>
            {report && (
                <div>
                    <h2>Codes remaining:</h2>
                    <ul>
                        <li>PG: {report.codesRemaining.PG}</li>
                        <li>NBDG: {report.codesRemaining.NBDG}</li>
                    </ul>
                    <h2>Emails</h2>
                    <ul>
                        {report.emails.length > 0 && (
                            <>
                                {report.emails.map(email => <li>{`${email.sent} ${email.to} ${email.store}`}</li>)}
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

const simpleDate = (input: Date): string => {
    return input.toISOString().split("T")[0]
}

const getFirstDayOfMonth = () => {
    const today = new Date()
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    return adjustDateWithTimeZoneOffset(firstOfMonth)
}

const getLastDayOfMonth = () => {
    const today = new Date()
    const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return adjustDateWithTimeZoneOffset(lastOfMonth)
}

const adjustDateWithTimeZoneOffset = (date: Date) => {
    const offset = date.getTimezoneOffset()
    return new Date(date.getTime() - (offset * 60 * 1000))
}
