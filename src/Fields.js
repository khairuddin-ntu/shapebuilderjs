import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function Fields() {
    return (
        <Box sx={{ borderTop: 1 }}>
            <Container>
                <Grid container>
                    <Grid item xs={1}>
                        <p>Resolution =</p>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            variant="outlined"
                            type="number"
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
