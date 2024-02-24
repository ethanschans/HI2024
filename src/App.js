import './App.css';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Box from '@mui/joy/Box';
import { useEffect, useState } from 'react';
import React from 'react';
import { Button, CircularProgress, Divider, FormLabel, Grid, Input, Textarea, Typography } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function ChatInput({
  onSubmit,
  nRows = 3,
  defaultSpeaker = "User",
}) {
  let [message, setMessage] = useState("");
  let [speaker, setSpeaker] = useState(defaultSpeaker);
  return <Textarea 
    minRows={nRows} 
    maxRows={nRows} 
    value={message}
    onChange={e => {
      setMessage(e.target.value);
    }}
    onKeyDown={(e) => {
      if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setMessage("");
        onSubmit({type: "response", content: message, speaker});
      }
    }}
    endDecorator={
      <Box
        sx={{
          display: 'flex',
          gap: 'var(--Textarea-paddingBlock)',
          pt: 'var(--Textarea-paddingBlock)',
          borderTop: '1px solid',
          borderColor: 'divider',
          flex: 'auto',
        }}
      >
        <Select 
          value={speaker}
          sx={{
            width: "25%",
          }}
          onChange={(_, value) => setSpeaker(value)}
        >
          <Option value={"Assistant"}>
            Assistant
          </Option>
          <Option value={defaultSpeaker}>
            {defaultSpeaker}
          </Option>
        </Select>
        {/* TODO */}
        <Button onClick={() => onSubmit({type: "prompt", content: message, speaker})} variant="outlined" sx={{ ml: 'auto' }}>Prompt</Button>
        {/* TODO */}
        <Button onClick={() => onSubmit({type: "response", content: message, speaker})}>Send</Button>
      </Box>
    }
  />;
}

function ChatSettings({ 
  chat, 
  refresh,
  onDelete,
}) {
  let [name, setName] = useState(null);
  let [chatId, setChatId] = useState(null);

  useEffect(() => {
    if (chat) {
      if (name === null) {
        setName(chat.name);
      }
      if (chatId !== chat.id) {
        setName(chat.name);
        setChatId(chat.id);
      }
    }
  }, [chat]);

  if (!chat) {
    return;
  }

  const editChat = async (data) => {
    const response = await fetch(BASE_API_URL + '/chat/' + chatId + '/edit',
    {
      method: 'POST', 
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(data)
    });
    if (response.ok) {
      await response.json();
      refresh();
    }
    else {
      // TODO: Error
    }
  };

  const deleteChat = async () => {
    const response = await fetch(BASE_API_URL + '/chat/' + chatId + '/delete',
    {
      method: 'POST'
    });
    if (response.ok) {
      await response.json();
      refresh();
      onDelete();
    }
    else {
      // TODO: Error
    }
  };

  return (
    <Box
        p={2}
        sx={{
          boxShadow: "0 1em 1em rgba(1, 1, 1, 0.2)",
        }}
      >
        <FormLabel>Chat Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)}/>
        <Grid 
          container 
          direction="row"
          justifyContent="center"
          alignItems="center"
          pt={4}
        >
          <Box px={1}>
            <Button startDecorator={<SaveIcon/>} onClick={() => editChat({ name })}>Save Settings</Button>
          </Box>
          <Box px={1}>
            <Button startDecorator={<DeleteIcon/>} onClick={deleteChat} color="danger">Delete Chat</Button>
          </Box>
        </Grid>
      </Box>
  );
}

function ChatLog({
  options,
  refresh,
  create,
  layer = 0,
}) {
  let [chatIdx, setChatIdx] = useState(null);
  let [showSettings, setShowSettings] = useState(false);
  let [messages, setMessages] = useState([]);
  let [latestMessageId, setLatestMessageId] = useState(-1);
  
  const HEADER_SIZE = 64;
  const FOOTER_SIZE = 180;
  
  useEffect(() => {
    if (options?.length > 0 && !chatIdx) {
      setChatIdx(0)
    }
  }, [chatIdx, options]);

  const getHistory = async () => {
    if (!options || options.length < 1 || chatIdx === null) {
      return;
    }
    const response = await fetch(BASE_API_URL + '/chat/' + options[chatIdx].id + '/history');
    if (response.ok) {
      const results = await response.json();
      setMessages(results);
    }
    else {
      // TODO error notification
    }
  }

  const onChatSubmit = async (data) => {
    const submissionData = {
      ...data,
      latestMessageId,
      layer,
    }
    const response = await fetch(BASE_API_URL + '/chat/new',
    {
      method: 'POST', 
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(submissionData)
    });
    if (response.ok) {
      const results = await response.json();
      setLatestMessageId(results.id);
      getHistory(); // TODO: Don't reload entire chat.
    }

  }

  useEffect(() => {
    getHistory();
  }, []);

  console.log(messages);

  if (!options || options.length < 1) {
    return;
  }
  const handleChange = (
    _, value
  ) => {
    if (value < 0) {
      create({name: new Date().toLocaleString()}, setChatIdx);
    } else {
      setChatIdx(value);
    }
  };
  const selectedChatName = chatIdx !== null? options[chatIdx].name : <CircularProgress />;
  return (
    <Box>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.vars.palette.background.body,
          width: "100%",
          position: "fixed",
          zIndex: 2,
        })}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={2}
          px={1}
        >
          <Button 
            variant="plain" 
            startDecorator={
              showSettings?
              <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>
            } 
            onClick={() => setShowSettings(!showSettings)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.0)",
              },
              "&:active": {
                backgroundColor: "rgba(0, 0, 0, 0.0)",
              },
            }}
          >
            <Typography level="title-lg" noWrap>{selectedChatName}</Typography>
          </Button>
          <Select 
            value={chatIdx}
            onChange={handleChange}
            sx={{
              width: "25%",
            }}
          >
            {options.map((option, idx) => <Option key={option.id} value={idx} label={option.name}>{option.name}</Option>)}
            <Option key={-1} value={-1} label={"Create New"}>
              <AddIcon/> Create New Chat
            </Option>
          </Select>
        </Grid>
        <Divider/>
      </Box>
      {
      showSettings && 
      <Box
        pt={`${HEADER_SIZE}px`}
        sx={
          (theme) => ({
            backgroundColor: theme.vars.palette.background.body,
            width: "100%",
            position: "fixed",
            zIndex: 1,
          })
        }
      >
        <ChatSettings chat={options[chatIdx]} refresh={refresh} onDelete={() => (chatIdx > 0) && setChatIdx(chatIdx-1)} />
      </Box>
      }
      <Box p={2}>
        <Box
          mt={`${HEADER_SIZE}px`}
          sx={(theme) => ({
            height: `calc(100vh - ${FOOTER_SIZE}px - ${HEADER_SIZE}px)`,
            overflowY: "scroll",
            '&::-webkit-scrollbar': {
              width: "0.5em",
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.2)`,
              borderRadius: "1em",
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.4)`,
            },
            '&::-webkit-scrollbar-thumb:active': {
              backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.6)`,
            },
          })}
          mb={2}
        >
          <Box p={5}>
            <Button> One</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 2</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 3</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 4</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 5</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 6</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 7</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 8</Button>
          </Box>
          <Divider/>
          <Box p={5}>
            <Button> 9</Button>
          </Box>
          <Divider/>
        </Box>
        <ChatInput onSubmit={onChatSubmit}/>
      </Box>
    </Box>
  );
}

function App() {
  let [allChats, setAllChats] = useState(null);
  let [loaded, setLoaded] = useState(false);

  const createChat = async (data, updateCurrentChat) => {
    const response = await fetch(BASE_API_URL + '/chat/new',
    {
      method: 'POST', 
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(data)
    });
    if (response.ok) {
      loadChats();
      updateCurrentChat(0);
    }
  }

  const loadChats = async () => {
    setLoaded(false);
    const response = await fetch(BASE_API_URL + '/chats');
    if (response.ok) {
      const results = await response.json();
      setAllChats(results);
      setLoaded(true);
    }
    else {
      setAllChats(null);
    }
  }

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (loaded && allChats.length < 1) {
      createChat({name: new Date().toLocaleString()}, loadChats);
    }
  }, [loaded, allChats]);



  return <ChatLog options={allChats} refresh={loadChats} create={createChat}/>;
}

export default App;
