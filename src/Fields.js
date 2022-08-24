import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FunctionField from './FunctionField';

export default function Fields() {
    return (
        <Box sx={{ borderTop: 1 }}>
            <Container>
                <Grid container>
                    <FunctionField functionName="x"/>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={4}></Grid>
                    <FunctionField functionName="y"/>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={4}></Grid>
                    <FunctionField functionName="z"/>
                    <Grid item xs={1}>
                        <p>Resolution =</p>
                    </Grid>
                    <Grid item xs={4}>
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
