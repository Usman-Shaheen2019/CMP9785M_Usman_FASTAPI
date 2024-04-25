import { Card, CardContent, Stack, Typography, Avatar, Box } from '@mui/material';
import { formatDate } from '../utils/constants';

function DisplayJoke({ JokeDetails }) {
  return (
    <Stack
      spacing={2}
      direction="column"
      alignItems="center"
      sx={{
        overflowY: "auto",
        height: { sx: "auto", md: "95%" },
      }}
    >
      {JokeDetails.map((JokeDetail, index) => (
        <Card key={index} sx={{ width: '100%', boxShadow: 1, my: 2 }}>
          <Box sx={{ overflow: 'auto' }}> {/* Wrapper Box */}
            <CardContent sx={{ height: 'auto', '&:last-child': { pb: 2 } }}>
              <Stack direction="column" alignItems="flex-start" spacing={1}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar alt={JokeDetail.author_name} src={JokeDetail.author_avatar} />
                  <Stack>
                    <Typography variant="subtitle1">
                      {JokeDetail.author_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(JokeDetail.created_at)}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                  {JokeDetail.text}
                </Typography>
              </Stack>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Stack>
  );
}

export default DisplayJoke;