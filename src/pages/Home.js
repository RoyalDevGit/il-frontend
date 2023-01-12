import React, { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { TextField, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import FadeIn from 'react-fade-in';
import axios from 'axios';

let initialVotes = [];
for (let i = 0; i < 30; i++) {
  initialVotes.push(Math.floor(Math.random() * 20));
}

export default function Home() {
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const getData = async () => {
      const result = (await axios.get(process.env.REACT_APP_API_ENDPOINT)).data.data;
      setData(result.map((item, index) => {
        item.vote = initialVotes[index]
        return item;
      }));
    }
    getData();
  }, [debouncedSearchTerm]);

  return (
    <>
      <Typography variant='h3' gutterBottom>
        Anime List
      </Typography>
      <TextField label={'Search By Name'} margin="dense" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} gutterBottom />
      <List>
        <FadeIn>
          {data.map((item, index) => (
            <ListItem key={index}>
              <img src={item.images.webp.image_url} alt='alt' />
              <ListItemText>
                <Typography variant='h5'>
                  {item.title}
                </Typography>
              </ListItemText>
              <ListItemText>
                {`${item.vote} Votes`}
              </ListItemText>
              <ListItemIcon>

              </ListItemIcon>
            </ListItem>
          ))}
        </FadeIn>
      </List>
    </>
  )
}