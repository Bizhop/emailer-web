import React, { useState } from "react"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import { Report, ReportEmail } from "./types"
import { client } from "./api"
import { Box, Button, List, ListItem, ListItemText, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

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
        <Box>
            <h1>Report</h1>
            <Box marginBottom={2}>
                <Stack direction="row" spacing={5}>
                    <Stack direction="row" spacing={1}>
                        <Box>From</Box>
                        <DatePicker dateFormat="yyyy-MM-dd" selected={dateFrom} onChange={setDateFrom} />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Box>To</Box>
                        <DatePicker dateFormat="yyyy-MM-dd" selected={dateTo} onChange={setDateTo} />
                    </Stack>
                </Stack>
            </Box>
            <Button variant="contained" onClick={() => getReport()}>Get report</Button>
            {report && (
                <Box>
                    <Box component={Paper} elevation={2} padding={2} marginTop={2}>
                        <h2>Codes remaining:</h2>
                        <List>
                            <ListItem><ListItemText primary={`PG: ${report.codesRemaining.PG}`} /></ListItem>
                            <ListItem><ListItemText primary={`NBDG: ${report.codesRemaining.NBDG}`} /></ListItem>
                        </List>
                    </Box>
                    <Box component={Paper} elevation={2} padding={2} marginTop={2}>
                        <h2>Emails</h2>
                        <TableContainer sx={{ maxHeight: 330 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>To</TableCell>
                                        <TableCell>Store</TableCell>
                                        <TableCell>Code</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {report.emails.map((email, index) => <RenderRow key={`report-row-${index}`} email={email} />)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

const RenderRow = ({ email }: { email: ReportEmail }): JSX.Element => {
    return (
        <TableRow>
            <TableCell>{email.sent}</TableCell>
            <TableCell>{email.to}</TableCell>
            <TableCell>{email.store}</TableCell>
            <TableCell>{email.code}</TableCell>
        </TableRow>
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
