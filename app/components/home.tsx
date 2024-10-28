import { useUsers } from '../data/users';
import styles from '../styles/Home.module.scss';
import { Box, Button, Card, CardContent, Typography, Link } from '@mui/material';
import { useEffect, useState } from 'react';

const Home = ({ navigateToVaalikone }: { navigateToVaalikone: () => void }) => {
  const [ip, setIp] = useState<string | null>(null);
  const { users, totalUsers } = useUsers();


  useEffect(() => {
    async function getIP() {
      const response = await fetch('https://api.ipify.org/?format=json');
      const data = await response.json();
      setIp(data.ip);
    }
    getIP();
  }, []);

  return (
    <div className={styles.home}>
      <h1>Tessan ja Visan 60-vuotisjuhlat</h1>
      <p>{ip ? ip : '...'}</p>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, marginTop: 4 }}>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6">Vieraita yhteensä</Typography>
            <Typography variant="h4">{totalUsers}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6">Soittolista</Typography>
            <div
              className="tidal-embed"
              style={{
                position: 'relative',
                paddingBottom: '100%',
                height: 0,
                overflow: 'hidden',
              }}
            >
              <iframe
                src="https://embed.tidal.com/playlists/fd5ef267-cf06-406b-84d6-44179e42a26e?layout=gridify"
                allow="encrypted-media"
                allowFullScreen
                frameBorder="0"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '1px',
                  minHeight: '100%',
                  margin: '0 auto',
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6">Vaalikoneen tulokset</Typography>
            <Typography variant="h4"/>
            <Button
              variant="contained"
              color="primary"
              onClick={navigateToVaalikone}
            >
              Tee vaalikone
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Istumajärjestys visualisaatio placeholder */}
      <Box sx={{ marginTop: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Istumajärjestys</Typography>
            <Box
              sx={{
                height: 200,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Placeholder
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Home;
