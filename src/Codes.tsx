import React, { useEffect, useState } from "react"
import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"

import { Code } from "./types"
import { client } from "./api"



export default () => {
    const [codes, setCodes] = useState<Code[]>([])
    const [used, setUsed] = useState(false)
    const [selectedStores, setSelectedStores] = useState<string[]>(["PG", "NBDG"])
    const [validityString, setValidityString] = useState("")
    const [textAreaInput, setTextAreaInput] = useState("")
    const [store, setStore] = useState("PG")

    useEffect(() => getCodes(), [used])

    const toggleUsed = () => setUsed(prevValue => !prevValue)
    const getCodes = () => {
        client.get("/codes")
            .then(response => setCodes(response.data))
            .catch(console.error)
    }

    const toggleStoreSelector = (store: string) => setSelectedStores(prevValues => {
        if (prevValues.includes(store)) {
            return prevValues.filter(value => value != store)
        }
        return [...prevValues, store]
    })

    const upload = () => {
        client.post(
            "/codes",
            textAreaInput,
            {
                params: {
                    "valid": validityString,
                    "store": store
                },
                headers: {
                    "Content-Type": "text/plain"
                }
            }
        )
            .then(() => {
                setTextAreaInput("")
                setValidityString("")
                getCodes()
            })
            .catch(console.error)
    }

    const filteredCodes = codes.filter(code => (code.used === used) && (selectedStores.length > 0 && selectedStores.includes(code.store)))
    return (
        <Box>
            <h1>Codes</h1>
            <Box component={Paper} padding={2} elevation={2}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={used} onChange={toggleUsed} />} label="Used" />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={selectedStores.includes("PG")} onChange={() => toggleStoreSelector("PG")} />} label="PG" />
                    <FormControlLabel control={<Checkbox checked={selectedStores.includes("NBDG")} onChange={() => toggleStoreSelector("NBDG")} />} label="NBDG" />
                </FormGroup>
                <p>Count: {filteredCodes.length}</p>
                <TableContainer sx={{ maxHeight: 330 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Store</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Valid</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCodes.map((code, index) => <RenderRow key={`code-row-${index}`} code={code} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box component={Paper} padding={2} elevation={2} marginTop={3}>
                <h2>Upload new codes</h2>
                <Stack direction="row" spacing={5}>
                    <Stack direction="column">
                        <TextField variant="outlined" label="Validity string" value={validityString} onChange={event => setValidityString(event.target.value)} />
                        <FormGroup sx={{ marginTop: 5 }}>
                            <FormLabel>Store</FormLabel>
                            <RadioGroup defaultValue="PG">
                                <FormControlLabel value="PG" control={<Radio onClick={() => setStore("PG")} />} label="PG" />
                                <FormControlLabel value="NBDG" control={<Radio onClick={() => setStore("NBDG")} />} label="NBDG" />
                            </RadioGroup>
                        </FormGroup>
                    </Stack>
                    <TextField variant="outlined" label="New codes" multiline minRows={10} fullWidth value={textAreaInput} onChange={event => setTextAreaInput(event.target.value)} />
                </Stack>
                <Button variant="contained" onClick={() => upload()}>Upload</Button>
            </Box>
        </Box>
    )
}

const RenderRow = ({ code }: { code: Code }): JSX.Element => {
    return (
        <TableRow>
            <TableCell>{code.store}</TableCell>
            <TableCell>{code.code}</TableCell>
            <TableCell>{code.valid}</TableCell>
        </TableRow>
    )
}
