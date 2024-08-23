import { Box, Container, Paper, Stack } from "@mui/material"
import { GoogleOAuthProvider } from "@react-oauth/google"
import React from "react"
import { Link, Outlet } from "react-router-dom"

export default () =>
    <GoogleOAuthProvider clientId="759223149650-po0g7p118sc2l3hqqlnb607ihv90c3kp.apps.googleusercontent.com">
        <Container component={Paper} elevation={3}>
            <Box sx={{ height: "90vh" }}>
                <Stack direction="column">
                    <Stack direction="row" spacing={3} padding={1}>
                        <Link to="codes">CODES</Link>
                        <Link to="report">REPORT</Link>
                        <Link to="sheetsrequests">SHEETS REQUESTS</Link>
                        <Link to="mailtest">EMAIL TEST</Link>
                    </Stack>
                    <Outlet />
                </Stack>
            </Box>
        </Container>
    </GoogleOAuthProvider>
