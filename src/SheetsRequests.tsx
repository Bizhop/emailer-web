import React, { useEffect, useState } from "react"
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, SelectChangeEvent, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, IconButton, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

import { client } from "./api"
import { Response, SheetsRequest } from "./types"
import { useCredentials } from "./CredentialsContext"

type CompleteParams = {
    send: boolean,
    competition?: string,
    date?: string
}

export default () => {
    const [requests, setRequests] = useState<SheetsRequest[]>([])
    const [ids, setIds] = useState<Set<number>>(new Set<number>())
    const [status, setStatus] = useState("REQUESTED")
    const [previews, setPreviews] = useState<Response[]>([])
    const [previewModalOpen, setPreviewModalOpen] = useState(false)
    const [infoOpt, setInfoOpt] = useState("")
    const [dateOpt, setDateOpt] = useState("")

    const { token } = useCredentials()

    const infoOptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfoOpt(event.target.value)
    }

    const dateOptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateOpt(event.target.value)
    }

    useEffect(() => getRequests(status), [status])

    const setRequestsSorted = (requests: SheetsRequest[]) => setRequests(requests)

    const getNewRequests = () => {
        client.get("/sheetsrequests/new", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setRequestsSorted(response.data))
            .catch(console.error)
    }

    const getRequests = (status: string) => {
        setIds(new Set<number>())
        if (status == "-ALL-") {
            client.get("/sheetsrequests", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setRequestsSorted(response.data))
                .catch(console.error)
        }
        else {
            client.get("/sheetsrequests", {
                params: {
                    "status": status
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => setRequestsSorted(response.data))
                .catch(console.error)
        }
    }

    const reject = () => {
        client.post(
            "/sheetsrequests/reject",
            JSON.stringify(Array.from(ids.values())),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => setRequestsSorted(response.data))
            .catch(console.error)
    }

    const complete = (send: boolean) => {
        var params: CompleteParams = { "send": send }
        if(infoOpt.length > 0) {
            params = {...params, "competition": infoOpt}
        }
        if(dateOpt.length > 0) {
            params = {...params, "date": dateOpt}
        }
        client.post(
            "/sheetsrequests/complete",
            JSON.stringify(Array.from(ids.values())),
            {
                params,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setPreviews(response.data)
                setPreviewModalOpen(true)
            })
            .catch(console.error)
    }

    const toggleId = (id: number) => {
        setIds(prevIds => {
            if (prevIds.has(id)) {
                prevIds.delete(id)
            }
            else {
                prevIds.add(id)
            }
            return new Set(prevIds)
        })
    }

    const togglePreviewModal = () => setPreviewModalOpen(prevValue => !prevValue)

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string)
    }

    return (
        <Box>
            <PreviewModal responses={previews} isOpen={previewModalOpen} toggleModal={togglePreviewModal} complete={complete} />
            <h1>Sheets Requests</h1>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => getNewRequests()}>Get new requests from sheets</Button>
                </Stack>
                <FormControl>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status-select"
                        value={status}
                        label="Status"
                        onChange={handleStatusChange}
                    >
                        <MenuItem value="-ALL-">-ALL-</MenuItem>
                        <MenuItem value="REQUESTED">REQUESTED</MenuItem>
                        <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                        <MenuItem value="REJECTED">REJECTED</MenuItem>
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={2}>
                    <TextField
                        id="infoOptField"
                        label="Competition info (optional)"
                        value={infoOpt}
                        onChange={infoOptOnChange}
                    />
                    <TextField
                        id="dateOptField"
                        label="Competition date (optional)"
                        value={dateOpt}
                        onChange={dateOptOnChange}
                    />
                    <Button variant="contained" onClick={() => complete(false)}>Complete (preview)</Button>
                    <Button variant="contained" color="error" onClick={reject}>Reject</Button>
                </Stack>
                {requests.length > 0 && (
                    <Box component={Paper} padding={2} elevation={2}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Competition info</TableCell>
                                    <TableCell>Competition date</TableCell>
                                    <TableCell>Store</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((request) => <RequestItem key={`request-${request.id}`} data={request} ids={ids} toggleId={toggleId} />)}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Stack>
        </Box>
    )
}

const RequestItem = ({ data, ids, toggleId }: { data: SheetsRequest, ids: Set<number>, toggleId: (id: number) => void }): JSX.Element => {
    return (
        <TableRow onClick={() => toggleId(data.id)} className={(ids.has(data.id) ? "selected" : "") + " selectable"}>
            <TableCell>{data.id}</TableCell>
            <TableCell>{data.timestamp}</TableCell>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.email}</TableCell>
            <TableCell>{data.competitionInfo}</TableCell>
            <TableCell>{data.competitionDate}</TableCell>
            <TableCell>{data.store}</TableCell>
            <TableCell>{data.status}</TableCell>
        </TableRow>
    )
}

const PreviewModal = ({ responses, toggleModal, isOpen, complete }: { responses: Response[], toggleModal: () => void, isOpen: boolean, complete: (send: boolean) => void }): JSX.Element => {
    return (
        <Dialog open={isOpen} onClose={toggleModal} maxWidth="md" fullWidth>
            <DialogTitle>
                Preview
                <IconButton
                    aria-label="close"
                    onClick={toggleModal}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Stack direction="column" spacing={2}>
                {responses.map((response, index) => <ResponseItem key={`response-${index}`} response={response} />)}
                <Button variant="contained" onClick={() => complete(true)}>Complete (send)</Button>
            </Stack>
        </Dialog>
    )
}

const ResponseItem = ({ response }: { response: Response }): JSX.Element | null => {
    const [emailVisible, setEmailVisible] = useState(false)
    const { error, email } = response

    if (email) return (
        <Box padding={2}>
            <h3 onClick={() => setEmailVisible(prevValue => !prevValue)}>{email.to}</h3>
            {emailVisible && <>
                <p>{email.timestamp}</p>
                <h2>{email.subject}</h2>
                <p style={{ whiteSpace: "pre-line" }}>{email.content}</p>
            </>
            }
        </Box>
    )
    else if (error) return (
        <Box padding={2}>
            <p>{error}</p>
        </Box>
    )
    else return null
}