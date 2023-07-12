import React, { useState } from "react"
import { Box, Button, Checkbox, Dialog, DialogTitle, FormControlLabel, FormGroup, Icon, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Zoom } from "@mui/material"
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import CloseIcon from "@mui/icons-material/Close"

import { client } from "./api"
import { Response, ResponseEmail } from "./types"


export default () => {
    const [send, setSend] = useState(false)
    const [responses, setResponses] = useState<Response[]>([])
    const [textAreaInput, setTextAreaInput] = useState("")
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [email, setEmail] = useState<ResponseEmail | null>(null)

    const toggleSend = () => setSend(prevValue => !prevValue)
    const toggleEmailModal = () => setEmailModalOpen(prevValue => !prevValue)
    const upload = () => {
        client.post(
            "/request",
            textAreaInput,
            {
                params: {
                    "send": send
                },
                headers: {
                    "Content-Type": "text/plain"
                }
            }
        )
            .then(responses => setResponses(responses.data))
            .catch(console.error)
    }

    return (
        <Box>
            <EmailModal email={email} isOpen={emailModalOpen} toggleModal={toggleEmailModal} />
            <h1>Request</h1>
            <Stack direction="column" spacing={2}>
                <Box component={Paper} padding={2} elevation={2}>
                    <Stack direction="column" spacing={2}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={send} onChange={toggleSend} />} label="Send" />
                        </FormGroup>
                        <TextField variant="outlined" label="Requests" multiline minRows={10} fullWidth value={textAreaInput} onChange={event => setTextAreaInput(event.target.value)} />
                        <Button variant="contained" onClick={() => upload()}>Upload</Button>
                    </Stack>
                </Box>
                {responses.length > 0 && (
                    <Box component={Paper} padding={2} elevation={2}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>To</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {responses.map((response, index) => <Item key={`response-${index}`} data={response} setEmail={setEmail} toggleEmailModal={toggleEmailModal} />)}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Stack>
        </Box>
    )
}

const Item = ({ data, setEmail, toggleEmailModal }: { data: Response, setEmail: (email: ResponseEmail) => void, toggleEmailModal: () => void }): JSX.Element | null => {
    const { error, email } = data

    if (email) return (
        <TableRow>
            <TableCell>{email.timestamp}</TableCell>
            <TableCell>{email.to}</TableCell>
            <TableCell>
                <IconButton onClick={() => {
                    console.log("click")
                    setEmail(email)
                    toggleEmailModal()
                }}>
                    <ZoomInIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
    else if (error) return (
        <TableRow>
            <TableCell colSpan={5}>{error}</TableCell>
        </TableRow>
    )
    else return null
}

const EmailModal = ({ email, toggleModal, isOpen }: { email: ResponseEmail | null, toggleModal: () => void, isOpen: boolean }): JSX.Element | null => {
    if (!email) return null

    return (
        <Dialog open={isOpen} onClose={toggleModal} maxWidth="md" fullWidth>
            <DialogTitle>
                Email
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
            <Box padding={2}>
                <h3>{email.to}</h3>
                <p>{email.timestamp}</p>
                <h2>{email.subject}</h2>
                <p style={{ whiteSpace: "pre-line" }}>{email.content}</p>
            </Box>
        </Dialog>
    )
}
