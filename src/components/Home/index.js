import React, { Fragment, useEffect, useState } from "react";
import useErrorHandler from "../../utils/errorHandler";
import Login from "../Login";
import Error from "../Error";
import Loader from "../Loader";
import EditorContainer from '../EditorContainer';
import AuthService from '../../services/AuthService';

const Home = () => {
    const { error, showError, handleClose } = useErrorHandler();
    const [showLogin, setShowLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        (async () => {
            let getUserResult = await AuthService.getCurrentAuthenticatedUser();
            /*  if (document.querySelector("iframe")) {
                 document.querySelector("iframe").remove();
             } */
            setLoading(false);
            if (getUserResult.success) {
                setShowLogin(false);
                setCurrentUser(getUserResult.user);
            }
            else {
                setShowLogin(true);
            }
        })();
    }, []);

    const onLoginCompleted = () => {
        setShowLogin(false);
    }

    return (
        <>
            <Error open={error !== null} handleClose={handleClose} message={error} />
            {
                loading
                    ?
                    <Loader show={true}></Loader>
                    :
                    <>
                        {
                            showLogin
                                ?
                                <Login onLoginCompleted={onLoginCompleted}></Login>
                                :
                                <EditorContainer></EditorContainer>
                        }
                    </>
            }
        </>
    );
};

export default Home;
