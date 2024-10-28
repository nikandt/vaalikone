import { Box, Typography, CircularProgress } from '@mui/material';

// Function to chunk an array into groups of 'size'
function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

interface Match {
    distance: number;
    percentage: number;
    secondAnswererId: string;
  }
  

function SeatingArrangement({ matches, currentUserId }) {
  // Step 1: Sort by distance, then by percentage descending
  const sortedMatches = matches.sort(( a : Match, b : Match) => 
    a.distance - b.distance || b.percentage - a.percentage,
  );

  // Step 2: Group into tables of 4
  const tables = chunkArray(sortedMatches, 4);

  // Step 3: Group tables into columns of 3 tables per column
  const columns = chunkArray(tables, 3);

  return (
    <Box display="flex" gap={4} p={2}>
      {columns.map((column, columnIndex) => (
        <Box key={columnIndex} display="flex" flexDirection="row" gap={2}>
          {column.map((table, tableIndex) => (
            <Box 
              key={tableIndex} 
              display="grid" 
              gridTemplateColumns="repeat(2, 1fr)" 
              gap={1}
              p={2}
              border="1px solid #ccc" 
              borderRadius={2}
            >
              {table.map((seat, seatIndex) => (
                <Box
                  key={seatIndex}
                  width={60} 
                  height={60}    
                  p={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  bgcolor={seat.secondAnswererId === currentUserId ? 'success.light' : 'primary.light'}
                  borderRadius="50%"
                >
                  <CircularProgress 
                    variant="determinate" 
                    value={seat.percentage * 100} 
                    size={40} 
                    thickness={4}
                  />
                  <Typography variant="caption" mt={1}>
                    {`${(seat.percentage * 100).toFixed(1)}%`}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default SeatingArrangement;
