//importing libraries
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  Badge,
  Grid,
  Breadcrumbs,
  Fab,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
//importing queries
import {
  CHANGE_PROFILE_PICTURE,
  CHANGE_PROFILE,
  GET_CURRENT_USER,
} from "../queries.js";


//This component is for allowing for the user to change their profile details


function ProfilePage({ account, setSteps }) {
  //declaring states
  const [wordCount, setWordCount] = useState(300); //the total word count for the about me
  const [wordAbout, setWordAbout] = useState(""); //the words for the about me
  const [name, setName] = useState(""); //their name
  const [lastName, setLastName] = useState(""); //their lastname
  const [image, setImage] = useState(); //the image
  const [fileUpload, setFileUpload] = useState(); //the file that is going to be upload if submitted

  const [uploadFile] = useMutation(CHANGE_PROFILE_PICTURE); //declares a mutation function that allows us to send a request to upload image to the database

  const [changePortfolio] = useMutation(CHANGE_PROFILE, { //declares a mutation function that allows us to change the profile image
    refetchQueries: [{ query: GET_CURRENT_USER }],//Once the function is called it calls the query to get the details for the user again
    onError: (error) => { //if there is an error
      console.log(error.graphQLErrors[0].message); //print out the error message
    },
  });

  useEffect(() => { //this is only called once
    //The following is for setting the steps for the product tour of my application
    //It firstly gets the element who's class is described by the element tag
    //The intro is the content of the steps
    setSteps([
      {
        element: ".profileEditStep1",
        intro: "To quickly go to the dashboard, click on the dashboard label",
      },
      {
        element: ".profileEditStep2",
        intro: "Edit your Profile page by clicking here",
      },
      {
        element: ".profileEditStep3",
        intro: "This is where you can view your current name",
      },
      {
        element: ".profileEditStep4",
        intro: "Here you can edit your name",
      },
      {
        element: ".profileEditStep5",
        intro: "This is where you can view your current last name",
      },
      {
        element: ".profileEditStep6",
        intro: "Edit your last name here",
      },
      {
        element: ".profileEditStep7",
        intro:
          "If you have entered something here, the greyish text is what you currently set as your about me. Here you can change your about me",
      },
      {
        element: ".profileEditStep8",
        intro:
          "This is where you can see your character counter, do not exceed 300 characters",
      },
      {
        element: ".profileEditStep9",
        intro: "Once you've made the appropriate changes, please click here",
      },
    ]);
  }, [setSteps]); //specifies its dependency
  const handleFileChange = (e) => { //Once the user uploads and is now uploading the file
    const file = e.target.files[0]; //get the file

    if (!file) return; //if there is no file then just return
    const fr = new FileReader(); //initialise a FileReader instance that allows us to read information of the file
    fr.onload = function () { //once it has done reading the file
      setImage(fr.result);  //set the image to the result of its reading from the file
    };
    fr.readAsDataURL(file); //read the data url eg. the encoding and set it to the file that is going to be used to upload to the backend
    setFileUpload(file); //set the file that is going be upload to the file
  };
  const handleSubmit = (e) => { //once the user submits the form
    e.preventDefault(); //prevent from reloading
    if (!fileUpload && !wordAbout && !lastName && !name) { //if the user has entered nothing into all of the fields
      console.log("you have entered nothing"); //display that they have entered nothing to the console
      //we do not need any feedback because this wouldn't destroy the system and when they do not upload anything
      //nothing changes
      return;
    }
    if (fileUpload) {//If the user has uploaded an image 
      uploadFile({ variables: { file: fileUpload } });  //send a request to the backend to upload the image
    }
    changePortfolio({ //changes the profile details
      variables: {
        name: !name ? account.name : name, //if the user has not entered their account name then use the current one else use the name that the user entered
        lastName: !lastName ? account.lastName : lastName,//if the user has not entered their account lastname then use the current one else use the lastname that the user entered
        aboutMe: !wordAbout ? account.aboutMe : wordAbout,//if the user has not entered their account aboutme then use the current one else use the aboutme that the user entered
      },
    });
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" style={{	fontWeight: 400,
	padding: 0,
	textTransform: "uppercase",
	fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
	color: "rgba(118, 118, 118, 1)",}}>Profile Page</Typography>
        <Breadcrumbs aria-label="breadcrumb" className="profileEditStep1">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            underline="hover"
            color="inherit"
            to="/DashBoard"
          >
            Dashboard
          </Link>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            underline="hover"
            color="inherit"
            to="/DashBoard/Profile"
          >
            Profile Page
          </Link>
        </Breadcrumbs>
      </Box>

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={10}
        direction="row"
      >
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            id="contained-button-file"
            style={{ display: "none" }}
          />
          <label htmlFor="contained-button-file" className="profileEditStep2">
            <Fab component="span" style={{ height: 300, width: 300 }}>
              <Badge
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                color="primary"
                overlap="circular"
                badgeContent="Edit"
              >
                <Avatar
                  alt="Remy Sharp"
                  style={{ height: 300, width: 300 }}
                  src={!image ? account.imageProfile : image}
                />
              </Badge>
            </Fab>
          </label>
        </Grid>

        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Box sx={{ minWidth: "45%" }}>
            <Typography
              variant="h5"
              color="primary"
              style={{ display: "inline" }}
              className="profileEditStep3"
            >
              Name: <span style={{color: "black"}}>{account.name}</span>
            </Typography>
            <TextField
              className="profileEditStep4"
              fullWidth
              value={name}
              placeholder="Enter name"
              inputProps={{ maxLength: 10 }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Box>
          <Box sx={{ minWidth: "45%" }}>
            <Typography
              variant="h5"
              color="primary"
              className="profileEditStep5"
            >
              LastName: {" "}
               <span style={{color: "black"}}>{account.lastName}</span>
            </Typography>
            <TextField
               placeholder="Enter lastName"
              className="profileEditStep6"
              fullWidth
              value={lastName}
              inputProps={{ maxLength: 10 }}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ minWidth: "90%", position: "relative" }}>
            <Typography variant="h5" color="primary">
              About me:
            </Typography>
            <TextField
              placeholder={account.aboutMe}
              className="profileEditStep7"
              variant="filled"
              inputProps={{ maxLength: 300 }}
              multiline
              rows={4}
              fullWidth
              maxRows={8}
              onChange={(e) => {
                setWordAbout(e.target.value);
                setWordCount(300 - e.target.value.length);
              }}
              value={wordAbout}
            />
            <Fab
              className="profileEditStep8"
              color="primary"
              style={{ position: "absolute", bottom: 16, right: 16 }}
            >
              {" "}
              {wordCount}
            </Fab>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          {" "}
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            {" "}
            <Typography variant="h5" className="profileEditStep9">
              Submit Change{" "}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProfilePage;
