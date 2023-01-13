import React, { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import {
  TextField, Typography,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Card, CardHeader, CardMedia, CardContent
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import FadeIn from 'react-fade-in';
import axios from 'axios';
import Button from '../components/Button';

let initialData = [];

export default function Home() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const getData = async () => {
    const result = (await axios.get(process.env.REACT_APP_API_ENDPOINT + `&q=${debouncedSearchTerm}`)).data.data;
    initialData = [...result];
    console.log('data', initialData);
    setData(result)
  }

  useEffect(() => {
    getData();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    let temp = [...data];
    setSortedData(temp.sort((a, b) => { return b.favorites - a.favorites }));
  }, [data]);

  const updateVote = (title, increment) => {
    const updated = data.map(item => {
      if (item.title === title) {
        if (increment !== -1 || item.favorites !== 0)
          item.favorites += increment;
      };
      return item;
    })
    setData(updated);
    console.log(initialData);
  }

  return (
    <>
      <Typography variant='h3' gutterBottom>
        Search Anime
      </Typography>
      <TextField label={'Search By Name'} margin="dense" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} />
      <br />
      <Button onClick={() => { getData(); }}>Reset Votes</Button>
      <FadeIn>
        <Paper style={{ display: 'flex', maxWidth: '500px', justifyContent: 'space-between', margin: 'auto', marginTop: '20px', padding: '10px' }}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              image={sortedData.length ? sortedData[0].images.webp.image_url : ''}
              height="225"
              alt="Paella dish"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {`Most Upvoted: ${sortedData.length ? sortedData[0].favorites : ''}`}
              </Typography>
            </CardContent>
            <CardHeader title={sortedData.length ? sortedData[0].title : ''} />
          </Card>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              image={sortedData.length ? sortedData[sortedData.length - 1].images.webp.image_url : ''}
              height="225"
              alt="Paella dish"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {`Most Downvoted: ${sortedData.length ? sortedData[sortedData.length - 1].favorites : ''}`}
              </Typography>
            </CardContent>
            <CardHeader title={sortedData.length ? sortedData[sortedData.length - 1].title : ''} />
          </Card>
        </Paper>
      </FadeIn>
      <Paper className='table-container'>
        <table>
          <caption>Anime List</caption>
          <thead>
            <tr>
              <th scope="col">Anime</th>
              <th scope="col">Type</th>
              <th scope="col">Votes</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.title}
                </td>
                <td>
                  {item.type}
                </td>
                <td>
                  {`${item.favorites} Votes`}
                </td>
                <td>
                  <Button type="submit" onClick={() => updateVote(item.title, 1)}>
                    <ThumbUpIcon />
                  </Button>
                  {' '}
                  <Button type="cancel" onClick={() => updateVote(item.title, -1)}>
                    <ThumbDownAltIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </>
  )
}