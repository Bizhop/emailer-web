import React, { useState } from "react"

import { client } from "./api"
import { Response } from "./types"

export default () => {
    const [send, setSend] = useState(false)
    const [responses, setResponses] = useState<Response[]>([])

    const toggleSend = () => setSend(prevValue => !prevValue)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        client.post(
            "/request",
            event.target[0].value,
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
        <div>
            <h1>Request</h1>
            <label>Send</label>
            <input type="checkbox" checked={send} onChange={toggleSend} />
            <form onSubmit={handleSubmit}>
                <textarea id="requests" name="requests" rows={10} cols={50} />
                <input type="submit" value="Request" />
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Subject</th>
                        <th>Content</th>
                    </tr>
                </thead>
                <tbody>
                    {responses.length > 0 && (
                        responses.map((response, index) => <Item key={`response-${index}`} data={response} />)
                    )}
                </tbody>
            </table>
        </div>
    )
}

const Item = ({ data }: { data: Response }) => {
    const { error, email } = data

    return (
        <tr>
            {email && (
                <>
                    <td>{email.timestamp}</td>
                    <td>{email.from}</td>
                    <td>{email.to}</td>
                    <td>{email.subject}</td>
                    <td>{email.content}</td>
                </>
            )}
            {error && (
                <td colSpan={5}>{error}</td>
            )}
        </tr>
    )
}

// ville.piispa@gmail.com,12.12.2023,PowerGrip.fi
