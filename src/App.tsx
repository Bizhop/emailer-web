import React from "react"
import { Box, Container, Paper, Stack } from "@mui/material"
import { googleLogout, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { Link, Outlet } from "react-router-dom"

import { CredentialsProvider, useCredentials } from "./CredentialsContext"

const App = () =>
    <CredentialsProvider>
        <GoogleOAuthProvider clientId="759223149650-po0g7p118sc2l3hqqlnb607ihv90c3kp.apps.googleusercontent.com">
            <PageContainer />
        </GoogleOAuthProvider>
    </CredentialsProvider>

const PageContainer = () => {
    const { token, setToken } = useCredentials()

    const logout = () => {
        setToken(null)
        googleLogout()
    }

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/spreadsheets.readonly',
        onSuccess: response => setToken(response.access_token),
        onError: error => console.error(error),
    })

    return (
        <Container component={Paper} elevation={3}>
            <Box sx={{ height: "90vh" }}>
                <Stack direction="column">
                    <Stack direction="row" spacing={3} padding={1}>
                        {token ?
                            <>
                                <Link to="codes">CODES</Link>
                                <Link to="report">REPORT</Link>
                                <Link to="sheetsrequests">SHEETS REQUESTS</Link>
                                {/* <Link to="mailtest">EMAIL TEST</Link> */}
                                <button onClick={() => logout()}>Logout</button>
                            </> :
                            <>
                                <button onClick={() => login()}>Login with Google</button>
                            </>
                        }
                    </Stack>
                    {token ? <Outlet /> : <h1>Please login</h1>}
                </Stack>
            </Box>
        </Container >
    )
}

export default App
