import React, { useEffect, useRef, useState } from "react"

import { Code } from "./types"
import { client } from "./api"

export default () => {
    const [codes, setCodes] = useState<Code[]>([])
    const [used, setUsed] = useState(false)
    const [validityString, setValidityString] = useState("")
    const [store, setStore] = useState("PG")

    useEffect(() => getCodes(), [used])

    const toggleUsed = () => setUsed(prevValue => !prevValue)
    const getCodes = () => {
        client.get("/codes")
            .then(response => setCodes(response.data))
            .catch(console.error)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        client.post(
            `/codes/${store.toLowerCase()}`,
            event.target[0].value,
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
            const textAreaElement = document.getElementById("newCodes") as HTMLTextAreaElement
            textAreaElement.value = ""
            setValidityString("")
            getCodes()
        })
        .catch(console.error)
    }

    return (
        <div>
            <h1>Codes</h1>
            <p>
                <label>Used</label>
                <input type="checkbox" checked={used} onChange={toggleUsed} />
            </p>
            <ul>
                {codes.filter(code => code.used === used).map(code => <Item key={code.id} code={code} />)}
            </ul>
            <h2>Upload new codes</h2>
            <label>Validity string</label>
            <input type="text" value={validityString} onChange={event => setValidityString(event.target.value)} />
            <h3>Store</h3>
            <label>PG</label>
            <input type="radio" name="store" value="PG" defaultChecked onClick={() => setStore("PG")} />
            <label>NBDG</label>
            <input type="radio" name="store" value="NBDG" onClick={() => setStore("NBDG")} />
            <form onSubmit={handleSubmit}>
                <textarea id="newCodes" name="newCodes" rows={10} cols={50} />
                <input type="submit" value="Upload" />
            </form>
        </div>
    )
}

const Item = ({ code }: { code: Code }) => <li>{`${code.store} ${code.code} ${code.valid}`}</li>
