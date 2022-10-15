import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TemplateItem from './TemplateItem';
import Template from '../common/Template';
import Parameter from '../common/Parameter';

import './TemplatesSection.css';

const templates = [
    new Template(
        "Sine Wave",
        "sine_wave.png",
        [
            "8(2u-1)",
            "2sin(10u*pi)",
            "0"
        ],
        [
            new Parameter("u", 100)
        ]
    ),
    new Template(
        "Plane",
        "plane.png",
        [
            "3(2u-1)",
            "0",
            "3(2v-1)"
        ],
        [
            new Parameter("u", 10),
            new Parameter("v", 10)
        ]
    ),
    new Template(
        "Sphere (Surface)",
        "sphere.png",
        [
            "2.5cos(-pi/2+u*pi)cos(-pi+2v*pi)",
            "2.5cos(-pi/2+u*pi)sin(-pi+2v*pi)",
            "2.5sin(-pi/2+u*pi)"
        ],
        [
            new Parameter("u"),
            new Parameter("v")
        ]
    ),
    new Template(
        "Cube (Solid)",
        "cube.png",
        [
            "1.5(2u-1)",
            "1.5(2w-1)",
            "1.5(2v-1)"
        ],
        [
            new Parameter("u", 3),
            new Parameter("v", 3),
            new Parameter("w", 3)
        ]
    ),
];

export default function TemplatesSection(props) {
    const selectTemplate = (i) => {
        console.log("selectTemplate: Selected template at index", i);
    };

    return (
        <Stack
            id={props.id}
            sx={{ borderRight: 1 }}
            spacing={3}
        >
            <Typography variant="h4">Templates</Typography>
            {templates.map((template, i) => (
                <TemplateItem
                    key={i}
                    templateItem={template}
                    onClick={() => selectTemplate(i)}
                />
            ))}
        </Stack>
    );
}
