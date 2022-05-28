//Importing Libraries
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Notification from "../Notification/Notification"
import { useNavigate } from "react-router-dom"; 
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

export default function LoginPage({ setToken }) {
  const [message, setMessage] = useState()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const messageSetter = (content) => {
    setMessage(content);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      messageSetter("Invalid credentials, please try again")
      console.log(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
      navigate("/DashBoard");
    }
  }, [result.data]); // eslint-disable-line
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    login({
      variables: {
        username: data.get("email"),
        password: data.get("password"),
      },
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Button onClick={() => {
            navigate("/");
         }}variant="contained" style={{ fontWeight: 900, letterSpacing: "2px", color: "black",    position: "fixed",
      top:30
, left: 30, backgroundColor: 'white'}}> CrySim. </Button>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

        }}
      >
        <Typography variant="h5">Sign in</Typography>
        <Notification message={message}/>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 , backgroundColor: 'orange'}}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item style={{display: 'flex', margin:'0 auto'}}>
              <Link href="SignUp" variant="body2" style={{ color: 'red'}}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
