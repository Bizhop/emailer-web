import { Box } from "@mui/material"
import { googleLogout, TokenResponse, useGoogleLogin } from "@react-oauth/google"
import React, { useState } from "react"
import { client } from "./api"

export default () => {
    const [credential, setCredential] = useState<TokenResponse | null>()

    const logout = () => {
        setCredential(null)
        googleLogout()
    }

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/spreadsheets.readonly',
        onSuccess: setCredential,
        onError: error => console.error(error),
      })

    const sendTestEmail = (token: string) => {
        client.post("/test-email", null, {headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}})
    }

    console.log(credential)

    return (
        <Box>
            <h1>Email test</h1>
            <button onClick={() => login()}>Login with Google</button>
            {credential && 
                <>
                    <p>Token: {credential.access_token}</p>
                    <p>Scopes: {credential.scope}</p>
                    <button onClick={() => sendTestEmail(credential.access_token)}>Send test email</button>
                    <button onClick={() => logout()}>Logout</button>
                </>
            }
        </Box>
    )
}
