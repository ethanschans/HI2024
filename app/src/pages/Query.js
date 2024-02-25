import { Container, Stack, Box, Typography, TextField, Button, styled, Icon, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import api from 'api';

const headerStyling = { 
    position: "absolute", 
    backdropFilter: "blur(10px)", 
    padding: "10px", 
    backgroundColor: "rgba(255, 255, 255, 0.2)", 
    boxShadow: "-4px 9px 25px -6px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
}
  
function History() {
    return (
      <Box sx={{
        backgroundColor: "gray",
        height: "calc(100vh - 2.75em)",
        width: "100%",
      }}>

      </Box>
    )
  }

const Query = () => {
    const [searchParams, _] = useSearchParams();
    const [message, setMessage] = useState("");
    const [repoList, setRepoList] = useState([]);
    const currentRepo = searchParams.get("repo");
    const [currentRepoName, setCurrentRepoName] = useState(currentRepo);

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
      }, [currentRepo]);

    

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
                            <Box sx={{ ...selected, py: "1.5em", px: "0.5em" }}>
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
                    <History/>
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
                        <Button sx={{m:"4px"}} variant={"outlined"} endIcon={<SendIcon />}>Send</Button>
                    </Box>
                </Box>
                <Container sx={{ width: "25vw", height: "100vw" }}>
                    aaa
                </Container>
            </Box>
        </Box>
    );
}

export default Query;