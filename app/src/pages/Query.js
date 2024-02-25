import { Container, Stack, Box, Typography, TextField, Button, styled, Icon, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import api from 'api';

const Role = {
    USER: 'user',
    BOT: 'bot',
};

const headerStyling = { 
    position: "absolute", 
    backdropFilter: "blur(10px)", 
    padding: "10px", 
    backgroundColor: "rgba(255, 255, 255, 0.2)", 
    boxShadow: "-4px 9px 25px -6px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
}

const Query = () => {
    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams();
    const [message, setMessage] = useState("");
    const [repoList, setRepoList] = useState([]);
    const [history, setHistory] = useState([]);
    let currentRepo = searchParams.get("repo");
    const [currentRepoName, setCurrentRepoName] = useState(currentRepo);

    const getHistory = () => {
        api.get(`/history/${encodeURIComponent(encodeURIComponent(currentRepo))}`)
            .then(function (response) {
                setHistory(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        api.post('/repo/create', {
            path: currentRepo,
        })
        .then(function (response) {
            setCurrentRepoName(response.data.name);
        })
        .catch(function (error) {
            console.log(error);
        });

        api.get('/repos')
        .then(function (response) {
            setRepoList(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

        getHistory();
      }, [currentRepo]);
    const sendMessage = () => {
        api.post('/history/create', {
            path: currentRepo,
            role: Role.USER,
            message: message,
        })
        .then(function (_) {
            setMessage("");
            getHistory();
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <Box sx={{ display: "flex" }} >
            <Box sx={{ p: 0, width: "20vw", height: "100vw", borderRight: "1px solid #dedede" }}>
                <Box sx={{ ...headerStyling, width: "20vw"}}><Typography variant="h6">Repositories</Typography></Box >
                <Box sx={{ m: "4em" }} />
                <Divider/>
                {repoList.map((repo, _) => {
                    const selected = repo.name === currentRepoName? { backgroundColor: "rgba(0, 0, 0, 0.05)" } : {};
                    return (
                        <Box key={repo.path}>
                            <Box onClick={() => navigate(`/query?repo=${repo.path}`)} sx={{ ...selected, py: "1.5em", px: "0.5em" }}>
                                <Typography>{repo.name}</Typography>
                            </Box>
                            <Divider/>
                        </Box>
                    );
                })}
            </Box>
            <Box sx={{ display: "flex", width: "80vw", height: "100vw"}}>
                <Box sx={{ ...headerStyling, width: "80vw" }}>
                    <Typography variant="h6" fontWeight="fontWeightMedium">{currentRepoName}</Typography>
                </Box>
                <Box sx={{ p: "0px", width: "55vw", height: "100vw", borderRight: "1px solid #dedede" }}>
                    <Box sx={{
                        maxHeight: "calc(100vh - 7em)",
                        minHeight: "calc(100vh - 7em)",
                        width: "100%",
                    }}>
                        <Box sx={{ m: "4em" }} />
                        {history.map((chat, _) => {
                            return (
                                <Box key={chat[0]}>
                                    <Box sx={{ py: "1.5em", px: "0.5em", alignItems: "right" }}>
                                        <Typography>{chat[1]}</Typography>
                                    </Box>
                                    <Divider/>
                                </Box>
                            );
                        })}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                        <TextField
                            size="small"
                            placeholder="Enter your query."
                            variant="outlined"
                            sx={{
                                mt: "2px",
                                height: "5px",
                                width: "100%",
                            }}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                        />
                        <Button sx={{m:"4px"}} onClick={sendMessage} variant={"outlined"} endIcon={<SendIcon />}>Send</Button>
                    </Box>
                </Box>
                <Box sx={{ width: "25vw", height: "100vw" }}>
                    
                </Box>
            </Box>
        </Box>
    );
}

export default Query;