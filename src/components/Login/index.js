import React, { Fragment, useEffect, useState } from "react";
import useErrorHandler from "../../utils/errorHandler";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import OTPVerification from "../OTPVerification";
import AuthService from '../../services/AuthService'
import Loader from "../Loader";

const Login = ({ onLoginCompleted }) => {
    const [email, setEmail] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loginDisabled, setLoginDisabled] = useState(false);
    const [codeVerificationErrorMessage, setCodeVerificationErrorMessage] = useState(null);
    const [codeVerificationSuccessMessage, setCodeVerificationSuccessMessage] = useState(null);

    const onLoginClick = async () => {
        setLoading(true);
        let result = await AuthService.signUp(email);
        result = await AuthService.signIn(email);
        if (result.success) {
            setCurrentUser(result.user);
            setOtpSent(true);
        }
        setLoading(false);
    }

    const onVerifyCode = async (code) => {
        setLoading(true);
        let result = await AuthService.verifyCode(currentUser, code);
        if (result.success) {
            setLoginDisabled(true);
            setCodeVerificationSuccessMessage("Code verified. Loading editor...")
            setTimeout(() => {
                onLoginCompleted && onLoginCompleted();
            }, 3000);
        }
        else {
            if (result.errorCode === "TOO_MANY_FAILED_ATTEMPTS") {
                setCodeVerificationErrorMessage(`Too many failed attempts. Please login again.`)
            }
            else {
                if (result.attemptsLeft > 0) {
                    setCodeVerificationErrorMessage(`Invalid code. Attempts left ${result.attemptsLeft}.`)
                }
                else {
                    setCodeVerificationErrorMessage(`Invalid code. Attempts left ${result.attemptsLeft}. Please login again.`)
                }
            }
        }
        setLoading(false);
    }

    return (
        <>
            <Loader show={loading}></Loader>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" }}>
                <Grid item sx={{ textAlign: "center" }}>
                    {
                        !otpSent && <Box
                            sx={{
                                textAlign: 'center', padding: '2em 0'
                            }}>
                            <TextField
                                sx={{ minWidth: "50vh" }}
                                helperText="Please enter your email"
                                label="Email"
                                onChange={(event) => setEmail(event.currentTarget.value)}
                            />
                        </Box>
                    }
                    {
                        otpSent && <OTPVerification
                            email={email}
                            onVerifyCode={onVerifyCode}
                            verificationErrorMessage={codeVerificationErrorMessage}
                            verificationSuccessMessage={codeVerificationSuccessMessage}>
                        </OTPVerification>
                    }
                    <Button variant="contained" color="primary" onClick={onLoginClick} disabled={loginDisabled}>
                        {otpSent ? "Login" : "Continue with email"}
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default Login;
