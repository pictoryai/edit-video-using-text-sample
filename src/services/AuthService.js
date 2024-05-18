import Chance from "chance";
import { Auth } from 'aws-amplify'

const getCurrentAuthenticatedUser = async () => {
    const result = {
        success: false,
        user: null
    }
    try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        result.user = cognitoUser;
        result.success = true;
    }
    catch (error) {
        result.success = false;
    }
    return result;
}

const signUp = async (email) => {
    const result = {
        success: false,
        errorCode: null,
        error: null,
    }
    try {
        const chance = new Chance()
        const password = chance.string({ length: 16 })
        const signupResult = await Auth.signUp({
            username: email,
            password: "@$Abcd1234"
        })
        result.success = true;
    }
    catch (error) {
        if (error.code === "UsernameExistsException") {
            result.errorCode = "USERNAME_EXISTS_EXCEPTION";
            result.error = error.message;
        }
        else {
            result.errorCode = "INTERNAL_ERROR";
            result.error = error.message;
        }
        result.success = false;
    }
    return result;
}

const signIn = async (email) => {
    const result = {
        success: false,
        user: null,
        attemptsLeft: 0
    }
    try {
        const cognitoUser = await Auth.signIn(email);
        result.user = cognitoUser;
        result.attemptsLeft = parseInt(cognitoUser.challengeParam.attemptsLeft);
        result.success = true;
        return result;
    }
    catch (error) {
        result.success = false;
    }
    return result;
}

async function verifyCode(cognitoUser, otpCode) {
    const result = {
        success: false,
        errorCode: null,
        attemptsLeft: 0
    }
    try {
        const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, otpCode)
        if (challengeResult.challengeName) {
            result.attemptsLeft = parseInt(challengeResult.challengeParam.attemptsLeft);
        } else {
            result.success = true;
        }
    } catch (error) {
        result.errorCode = "TOO_MANY_FAILED_ATTEMPTS";
    }
    return result;
}

export default {
    getCurrentAuthenticatedUser,
    signUp,
    signIn,
    verifyCode
}