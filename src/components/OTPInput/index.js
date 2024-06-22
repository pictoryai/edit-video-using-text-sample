import React, { useEffect, useState, useRef } from 'react';
import { TextField, Box } from '@mui/material';
import _ from 'lodash';

export default function OTPInput({
    codes,
    onCodeChanged,
    onCodeComplete,
    invalidCode,
    codeVerified,
    disabled = false,
}) {
    const [values, setValues] = useState(codes);
    const otpInputReft = useRef(new Array(codes.length).fill(null));

    useEffect(() => {
        if (otpInputReft.current && otpInputReft.current.length > 0) {
            otpInputReft.current[0].focus();
        }
    }, []);

    useEffect(() => {
        setValues(codes);
        let nonEmptyCode = codes.find(code => code);
        if (!nonEmptyCode && otpInputReft.current && otpInputReft.current.length > 0) {
            otpInputReft.current[0].focus();
        }
    }, [codes]);

    const onCodeValuesChange = (index, value) => {
        let currentValues = [...values];
        if (value) {
            if (isNaN(parseInt(value)) === false) {
                if (value.trim().length === 1) {
                    currentValues[index] = value;
                }

                if (index + 1 < otpInputReft.current.length) {
                    otpInputReft.current[index + 1].focus();
                }
            }
        } else {
            currentValues[index] = value;
        }

        onCodeChanged && onCodeChanged(currentValues);
        setValues(currentValues);
        if (_.every(currentValues, (value, index, collection) => value)) {
            onCodeComplete && onCodeComplete(currentValues);
        }
    };

    const onCodeValuePaste = event => {
        let pastedCodes = event.clipboardData.getData('Text').split('');
        let currentValues = [...values];
        let codeIndex = 0;
        for (let value of pastedCodes) {
            if (value) {
                if (value.match(/^[0-9]+$/)) {
                    if (value.trim().length === 1) {
                        currentValues[codeIndex] = value;
                        codeIndex++;
                    }
                }
            }
        }
        otpInputReft.current[codeIndex - 1].focus();
        onCodeChanged && onCodeChanged(currentValues);
        setValues(currentValues);
        return false;
    };

    const onKeyDown = (index, event) => {
        const key = event.key;
        if (key === 'Backspace' || key === 'Delete') {
            if (!values[index]) {
                if (index > 0) {
                    otpInputReft.current[index - 1].focus();
                }
            }
        }
        return true;
    };

    return (
        <Box
            className={[
                'otp-sms',
                invalidCode ? 'error-otp-sms' : '',
                codeVerified ? 'email-verified-success' : '',
                'd-flex w-100 justify-content-between',
            ].join(' ')}
            sx={{ padding: '2em 0' }}
        >
            {values.map((item, index) => {
                return (
                    <TextField
                        disabled={disabled}
                        type="number"
                        inputRef={(element) => otpInputReft.current[index] = element}
                        key={index}
                        variant="outlined"
                        value={item}
                        onChange={event => onCodeValuesChange(index, event.target.value)}
                        onFocus={event => event.target.select()}
                        onPaste={event => onCodeValuePaste(event)}
                        onKeyDown={event => onKeyDown(index, event)}
                        sx={{
                            height: '72px',
                            background: disabled ? 'lightgray' : '',
                            marginLeft: index > 0 ? "1rem" : "unset"
                        }}
                        autoComplete={'off'}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                );
            })}
        </Box>
    );
}
