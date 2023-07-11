import React, { Component, useEffect, useState } from "react"
import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel, List, ListItem, ListItemText, Paper, Radio, RadioGroup, Stack, TextField } from "@mui/material"
import { FixedSizeList, ListChildComponentProps } from "react-window"

import { Code } from "./types"
import { client } from "./api"



export default () => {
    const [codes, setCodes] = useState<Code[]>([])
    const [used, setUsed] = useState(false)
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

    const upload = () => {
        client.post(
            `/codes/${store.toLowerCase()}`,
            textAreaInput,
            {
                params: {
                    "valid": validityString
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

    const filteredCodes = codes.filter(code => code.used === used)
    return (
        <Box>
            <h1>Codes</h1>
            <Box component={Paper} padding={2} elevation={2}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={used} onChange={toggleUsed} />} label="Used" />
                </FormGroup>
                <FixedSizeList
                    height={300}
                    width="100%"
                    itemSize={25}
                    itemCount={filteredCodes.length}
                    overscanCount={5}
                    itemData={filteredCodes}
                >
                    {renderRow}
                </FixedSizeList>
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

const renderRow = (props: ListChildComponentProps<Code[]>): JSX.Element => {
    const { data, index, style } = props
    const code = data[index]

    return <ListItem key={`code-item-${index}`} style={style}><ListItemText primary={`${code.store} ${code.code} ${code.valid}`}></ListItemText></ListItem>
}
