import React, { Fragment, useEffect, useState } from "react";
import useErrorHandler from "../../utils/errorHandler";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { ErrorOutlineOutlined, Check } from '@mui/icons-material';
import OTPInput from "../OTPInput";
import API from '../../services/API'

const OTPVerification = ({ email, onVerifyCode, verificationErrorMessage, verificationSuccessMessage }) => {

    const [codeValues, setCodeValues] = useState(["", "", "", "", "", ""]);

    const onCodeProvided = (values) => {
        onVerifyCode && onVerifyCode(values.reduce((currentCode, code) => currentCode + code));
    }

    return (
        <Box
            sx={{
                textAlign: 'center'
            }}>
            <Typography variant="subtitle1b" color="grey.900" sx={{ display: 'block', lineHeight: '22px', wordBreak: 'break-all' }}>
                A one time login code has been sent to <Typography>{email}</Typography>
            </Typography>
            <Typography
                variant="text_sm"
                color="grey.500"
                className='check-inbox-text'
                sx={{ display: 'block', marginTop: '0.5em' }}
            >
                Please check your inbox and enter the one time login code below to login.
            </Typography>
            <OTPInput codes={codeValues} onCodeChanged={setCodeValues} onCodeComplete={onCodeProvided} invalidCode={verificationErrorMessage ? true : false} codeVerified={verificationSuccessMessage ? true : false} />
            {
                verificationErrorMessage && <Typography
                    variant="text_sm"
                    color="error.main"
                    sx={{ padding: '0 4em', display: 'block', marginTop: '0.5em', mb: '1em' }}>
                    <ErrorOutlineOutlined sx={{ mr: '10px' }} />
                    {verificationErrorMessage}
                </Typography>
            }
            {
                verificationSuccessMessage &&
                <Typography
                    variant="body1_resp"
                    color="success.main"
                    sx={{ padding: '0 4em', display: 'block', marginTop: '0.5em', mb: '1em' }}>
                    <Check sx={{ mr: '10px' }} />
                    {verificationSuccessMessage}
                </Typography>
            }
        </Box>
    );
};

export default OTPVerification;
