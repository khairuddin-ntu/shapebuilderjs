import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import './Operators.css';

export default function Operators(props) {
    return (
        <Grid
            container
            columns={2}
            id={props.id}
            sx={{ borderLeft: 1 }}
        >
            <Grid
                item
                xs={1}
            >
                <Typography variant="h4">Operators</Typography>
            </Grid>
        </Grid>
    );
}
