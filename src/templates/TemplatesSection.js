import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TemplateItem from './TemplateItem';
import { TEMPLATES } from "../common/Constants";

import './TemplatesSection.css';

export default function TemplatesSection(props) {
    const selectTemplate = (i) => props.applyTemplate(TEMPLATES[i]);

    return (
        <Stack
            id={props.id}
            sx={{ borderRight: 1 }}
            spacing={3}
        >
            <Typography variant="h4">Templates</Typography>
            {TEMPLATES.map((template, i) => (
                <TemplateItem
                    key={i}
                    templateItem={template}
                    onClick={() => selectTemplate(i)}
                />
            ))}
        </Stack>
    );
}
