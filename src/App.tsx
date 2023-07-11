import { Box, Container, Paper, Stack } from "@mui/material"
import React from "react"
import { Link, Outlet } from "react-router-dom"

export default () =>
    <Container component={Paper} elevation={3}>
        <Box sx={{ height: "90vh" }}>
            <Stack direction="column">
                <Stack direction="row" spacing={3} padding={1}>
                    <Link to="codes">CODES</Link>
                    <Link to="report">REPORT</Link>
                    <Link to="request">REQUEST</Link>
                </Stack>
                <Outlet />
            </Stack>
        </Box>
    </Container>
