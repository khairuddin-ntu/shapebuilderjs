import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function TemplateItem(props) {
    const templateItem = props.templateItem;

    return (
        <Stack
            alignItems="center"
            spacing={2}
        >
            <img
                src={`./img/${templateItem.imageFileName}`}
                loading="lazy"
                width="200"
                height="200"
            />
            <Typography>{templateItem.name}</Typography>
        </Stack>
    );
}
