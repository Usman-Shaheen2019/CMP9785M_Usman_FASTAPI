import 'react'
import '../App.css'

import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { getAPI } from '../utils/APIClient'
import { useAuth } from './AuthContext';
import { Category, DisplayJoke } from "./";
export const JokeDetails = [
{text: "JOKE 1", author: "Ali"},
{text: "JOKE 1", author: "Ali"}
]
function DailyFeeds () {
  const { accessToken, tokenType } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("DailyFeeds");
  const [jokeDetails, setJokeDetails] = useState([])

  useEffect(() => {
    setJokeDetails([]);
    console.log("-------------------------------",accessToken,tokenType)
    getAPI(`dailyjoke/${selectedCategory}/joke`,accessToken,tokenType)
      .then((data) => setJokeDetails(data))
    }, [selectedCategory]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <Typography className="copyright" variant="body2" sx={{ mt: 1.5, color: "#fff", }}>
          Copyright © 2024 - Lincoln University
        </Typography>

      </Box>

      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#FC1503" }}>"JOKES"</span>
        </Typography>

        <DisplayJoke JokeDetails= {jokeDetails}/>
      </Box>

    </Stack>
  );
};

export default DailyFeeds;