import React from "react"
import { Link, Outlet } from "react-router-dom"

export default () =>
    <div>
        <Link to="codes">Codes</Link>
        <Link to="report">Report</Link>
        <Link to="request">Request</Link>
        <Outlet />
    </div>
