import React from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import App from "./App"
import Report from "./Report"
import Codes from "./Codes"
import Request from "./Request"

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
                path: "request",
                element: <Request />
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
