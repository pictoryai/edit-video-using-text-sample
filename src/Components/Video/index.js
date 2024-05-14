// Video.js
import React, { Fragment } from "react";
import { Box, Button, Grid } from "@mui/material";
import { MAIN_VIDEO } from "../../Constants";

const Video = ({ onEdit }) => {
    return (
        <Fragment>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: "100vh" }}>
                <Grid item sx={{ textAlign: "center", p: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            mb: 2,
                            borderRadius: 1,
                            overflow: "hidden",
                        }}
                        boxShadow={1}
                    >
                        <Box
                            component={"iframe"}
                            sx={{
                                maxWidth: 1,
                                border: 0,
                            }}
                            src={MAIN_VIDEO}
                            width="800px"
                            height="450px"
                            title="Justin Trudeau & Barack Obama White House Rose Garden media conference, March 10, 2016"
                        ></Box>
                    </Box>
                    <Button onClick={onEdit} variant="contained" color="primary">
                        Edit Video
                    </Button>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default Video;
