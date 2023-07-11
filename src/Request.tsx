import React, { useState } from "react"
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Icon, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material"
import ZoomInIcon from '@mui/icons-material/ZoomIn'

import { client } from "./api"
import { Response } from "./types"


export default () => {
    const [send, setSend] = useState(false)
    const [responses, setResponses] = useState<Response[]>([])
    const [textAreaInput, setTextAreaInput] = useState("")

    const toggleSend = () => setSend(prevValue => !prevValue)
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
                                {responses.map((response, index) => <Item key={`response-${index}`} data={response} />)}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Stack>
        </Box>
    )
}

const Item = ({ data }: { data: Response }) => {
    const { error, email } = data

    if (email) return (
        <TableRow>
            <TableCell>{email.timestamp}</TableCell>
            <TableCell>{email.to}</TableCell>
            <TableCell><Icon component={ZoomInIcon}/></TableCell>
        </TableRow>
    )
    else if (error) return (
        <TableRow>
            <TableCell colSpan={5}>{error}</TableCell>
        </TableRow>
    )
    else return null
}
