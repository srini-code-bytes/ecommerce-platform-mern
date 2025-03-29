import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

// CREATE THE CONTEXT
const SnackbarContext = createContext();

// CREATE THE PROVIDER COMPONENT
export function SnackbarProvider({children}){
    const [snackbarData, setSnackbarData] = useState({
        open : false,
        message : "",
        severity : "info",
        autoHiddenDuration : 3000
    })


const showSnackbar = useCallback(
    ({message, severity = "info", autoHiddenDuration = 3000}) => {
        setSnackbarData({
            open : true,
            message,
            severity,
            autoHiddenDuration
        })
    },[]
)

const hideSnackbar = useCallback(() => {
    setSnackbarData((prev) => ({
        ...prev,
        open : false
    }))
})


return (
    <SnackbarContext.Provider value={{showSnackbar, hideSnackbar}}>
        {children}
        <Snackbar open={snackbarData.open} autoHideDuration={snackbarData.autoHiddenDuration} 
        onClose={hideSnackbar} anchorOrigin={{ vertical : "bottom", horizontal : "right"}}>
            <Alert onClose={hideSnackbar} severity={snackbarData.severity} sx={{ width : "100%"}}>
                {snackbarData.message}
            </Alert>

        </Snackbar>

    </SnackbarContext.Provider>
)
}

export function useSnackbar(){
    return useContext(SnackbarContext)
}

