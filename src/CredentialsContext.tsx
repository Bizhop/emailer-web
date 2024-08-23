import React, { createContext, useContext, useState } from "react"

const CredentialsContext = createContext<CredentialsState | null>(null)

type CredentialsProviderProps = {
    children: React.ReactNode
}

type CredentialsState = {
    token: string | null,
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}

export const CredentialsProvider = ({children}: CredentialsProviderProps) => {
    const [token, setToken] = useState<string | null>(null)

    return (
        <CredentialsContext.Provider value={{token, setToken}}>
            {children}
        </CredentialsContext.Provider>
    )
}

export const useCredentials = () => {
    const context = useContext(CredentialsContext)
    if(!context) {
        throw new Error("useCredentials must be used within a CredentialsProvider")
    }
    return context
}
