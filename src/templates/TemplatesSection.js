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
            new Parameter("u")
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
        "Sphere",
        "sphere.png",
        [
            "2.5cos(-pi/2+u*pi)cos(-pi+2v*pi)",
            "2.5cos(-pi/2+u*pi)sin(-pi+2v*pi)",
            "2.5sin(-pi/2+u*pi)"
        ],
        [
            new Parameter("u", 70),
            new Parameter("v", 70)
        ]
    ),
    new Template(
        "Parametric Sweeping",
        "parametric_sweeping.png",
        [
            "(0.7u*cos(-4u*pi+pi/2)+1+v)cos(5v*pi+pi)",
            "0.7u*sin(-4u*pi+pi/2)+4v",
            "(0.7u*cos(-4u*pi+pi/2)+1+v)sin(5v*pi+pi)"
        ],
        [
            new Parameter("u", 50),
            new Parameter("v")
        ]
    ),
];

export default function TemplatesSection(props) {
    return (
        <Stack
            id={props.id}
            sx={{ borderRight: 1 }}
            spacing={3}
        >
            <Typography variant="h4">Templates</Typography>
            {templates.map((template, i) => (
                <TemplateItem templateItem={template} />
            ))}
        </Stack>
    );
}
