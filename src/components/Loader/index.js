import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";

export default ({ show }) => {
    return (
        <>
            {
                show
                    ?
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                            height: "100%",
                            position: "absolute",
                            width: "100%",
                            zIndex: 100,
                            background: "gray",
                            opacity: 0.5
                        }}>
                        <CircularProgress size={40} sx={{ color: "rgba(18, 18, 18, 0.6)" }} />
                    </Box>
                    :
                    <></>
            }
        </>

    );
};