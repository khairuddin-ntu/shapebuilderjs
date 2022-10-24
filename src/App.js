import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import Templates from './templates/TemplatesSection';
import * as RenderJob from "./render/RenderJob";
import Parameter from './common/Parameter';
import { SnackbarError, SnackbarSuccess } from './common/SnackbarMessage';
import ShapeGenError from "./common/ShapeGenError";

import './App.css';

export default function App() {
    const [snackbarMessage, setSnackbarMessage] = useState();
    const [functionInputs, setFunctions] = useState();
    const [parameters, setParameters] = useState();
    const [renderData, setRenderData] = useState();
    const [runGenerateShape, setRunGenerateShape] = useState(false);

    const parameterErrors = useRef([null, null, null]);

    useEffect(() => {
        const functionInputs = [
            "2.5cos(-pi/2+u*pi)cos(-pi+2v*pi)",
            "2.5cos(-pi/2+u*pi)sin(-pi+2v*pi)",
            "2.5sin(-pi/2+u*pi)"
        ];
        const parameters = [new Parameter("u"), new Parameter("v")];

        setFunctions(functionInputs);
        setParameters(parameters);
        setRunGenerateShape(true);
    }, []);

    useEffect(() => {
        if (!runGenerateShape) {
            return;
        }
        setSnackbarMessage(null);

        for (const paramError of parameterErrors.current) {
            if (!paramError) continue;
            setSnackbarMessage(paramError);
            return;
        }

        setRunGenerateShape(false);

        RenderJob.generateRenderData(functionInputs, parameters)
            .then(
                (renderData) => {
                    setRenderData(renderData);
                    setSnackbarMessage(new SnackbarSuccess("Successfully rendered shape"));
                },
                (err) => {
                    if (!(err instanceof ShapeGenError)) {
                        throw err;
                    }

                    setSnackbarMessage(new SnackbarError(err.message));
                }
            );
    }, [functionInputs, parameters, runGenerateShape]);

    const applyTemplate = (templateItem) => {
        parameterErrors.current = [null, null, null];
        setFunctions(templateItem.functionInputs);
        setParameters(templateItem.parameters);
        setRunGenerateShape(true);
    };

    return (
        <Box id="app">
            <Templates id="templates" applyTemplate={applyTemplate} />
            <Scene renderData={renderData} />
            <Fields
                functions={functionInputs}
                setFunctions={setFunctions}
                parameters={parameters}
                setParameters={setParameters}
                parameterErrors={parameterErrors}
                generateShape={() => setRunGenerateShape(true)}
            />
            {
                snackbarMessage &&
                <Snackbar
                    open
                    autoHideDuration={6000}
                    onClose={() => setSnackbarMessage(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <MuiAlert elevation={6} variant="filled" severity={snackbarMessage.type}>
                        {snackbarMessage.message}
                    </MuiAlert>
                </Snackbar>
            }
        </Box>
    );
}

