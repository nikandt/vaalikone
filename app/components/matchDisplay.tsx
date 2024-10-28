import { Card, Typography, Box, LinearProgress } from '@mui/material';

interface MatchDisplayProps {
  matchPercentage: number;
  candidateName: string;
  distance: number;
}

const MatchDisplay = ({ matchPercentage, candidateName, distance }: MatchDisplayProps) => {
  return (
    <Card sx={{ padding: 2, minWidth: 250, maxWidth: 300, margin: 'auto', textAlign: 'center' }}>
      <Typography variant="h6">{candidateName}</Typography>
      <Typography variant="body2" color="textSecondary">
        Yhteensopivuus
      </Typography>
      <Box display="flex" alignItems="center" gap={2} my={1}>
        <Typography variant="h5">{Math.round(matchPercentage * 100)}%</Typography>
        <LinearProgress
          variant="determinate"
          value={matchPercentage * 100}
          sx={{ width: '100%', height: 10, borderRadius: 5 }}
        />
      </Box>
      <Typography variant="body2" color="textSecondary">
        Etäisyys: {distance}
      </Typography>
    </Card>
  );
};

export default MatchDisplay;
