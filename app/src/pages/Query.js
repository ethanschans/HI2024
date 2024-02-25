import { Container, Stack, Box, Typography, TextField, Button, styled, Icon } from '@mui/material';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

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
    return (
        <Box sx={{ display: "flex" }} >
            <Box sx={{ p: 0, width: "20vw", height: "100vw", borderRight: "1px solid #dedede" }}>
                <Box sx={{ ...headerStyling, width: "20vw"}}><Typography variant="h6"><b>{searchParams.get("repo")}</b></Typography></Box >
                aaa
            </Box>
            <Box sx={{ display: "flex", width: "80vw", height: "100vw"}}>
                <Box sx={{ ...headerStyling, width: "80vw" }}>
                    <Typography variant="h6">Chat</Typography>
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