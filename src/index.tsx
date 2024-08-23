import React from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import App from "./App"
import Report from "./Report"
import Codes from "./Codes"
import SheetsRequests from "./SheetsRequests"
import MailTest from "./MailTest"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "codes",
                element: <Codes />
            },
            {
                path: "report",
                element: <Report />
            },
            {
                path: "sheetsrequests",
                element: <SheetsRequests />
            },
            {
                path: "mailtest",
                element: <MailTest />
            }
        ]
    },
]
)

const app = document.getElementById("app")!
const root = createRoot(app)
root.render(
    <RouterProvider router={router} />
)
