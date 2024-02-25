import { Container, Stack, Box, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        The Chan Gang{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

const Main = () => {
    const navigate = useNavigate();
    const [repoUrl, setRepoUrl] = useState("");
    const [attemptInitialize, setAttemptInitialize] = useState(false);
    const hasError = attemptInitialize && (repoUrl.length < 1);
    const initialize = () => {
      // If invalid URL.
      if (repoUrl.length < 1) {
        setAttemptInitialize(true);
      } else {
        navigate(`/query?repo=${repoUrl}`);
      }

    };
    return (
      <Container maxWidth="sm">
        <Stack justifyContent={"center"} alignItems={"center"} minHeight={"100vh"}>
          <Box display="block">
          <Typography sx={{ textAlign: "center", mb: 2 }} variant="h1" component="h1">
            Code Query
          </Typography>
          <Typography sx={{ width: "50vw", textAlign: "center", mb: 2 }} variant="h5" component="h5">
            <i>
              Have a question about your codebase? We can help!
            </i>
          </Typography>
          </Box>
          <TextField
            value={repoUrl}
            onChange={(event) => {
              setRepoUrl(event.target.value);
              setAttemptInitialize(false);
            }}
            sx={{ width: "50vw", height: "10vh"}} 
            id="repo-url" 
            label="Repo URL" 
            variant="standard"
            error={hasError}
            helperText={hasError && "Please enter a Github repository URL."}
            />
          <Button sx={{ mt: 2, mb: 8 }} variant="outlined" onClick={initialize}>Initialize</Button>
          <Copyright />
        </Stack>
      </Container>
    );
}

export default Main;