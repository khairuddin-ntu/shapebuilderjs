import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function TemplateItem(props) {
    const templateItem = props.templateItem;

    return (
        <Stack
            sx={{
                border: 2,
                borderRadius: 2,
                borderColor: "background.paper",
                '&:hover': {
                    borderColor: "primary.main",
                }
            }}
            alignItems="center"
            spacing={2}
            onClick={props.onClick}
        >
            <img
                src={`./img/${templateItem.imageFileName}`}
                loading="lazy"
                width="150"
                height="150"
                alt={templateItem.imageFileName.slice(0, -4)}
            />
            <Typography>{templateItem.name}</Typography>
        </Stack>
    );
}
