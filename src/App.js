import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import Templates from './templates/TemplatesSection';
import { SnackbarError, SnackbarSuccess } from './common/SnackbarMessage';

import './App.css';
import { TEMPLATES } from './common/Constants';

const renderWorker = new Worker(new URL("./render/RenderJob.js", import.meta.url));

export default function App() {
    const [snackbarMessage, setSnackbarMessage] = useState();
    const [functionInputs, setFunctions] = useState();
    const [parameters, setParameters] = useState();
    const [renderData, setRenderData] = useState();
    const [runGenerateShape, setRunGenerateShape] = useState();
    const [isShapeLoading, setShapeLoading] = useState(false);

    const parameterErrors = useRef();

    useEffect(() => {
        renderWorker.onmessage = (event) => {
            const renderData = event.data;
            console.log(renderData);
            setRenderData(renderData);
            setShapeLoading(false);
            setSnackbarMessage(new SnackbarSuccess("Successfully rendered shape"));
        };

        renderWorker.onerror = (err) => {
            console.error(err);
            setShapeLoading(false);
            setSnackbarMessage(new SnackbarError("Error occured while generating render data"));
        };

        applyTemplate(TEMPLATES[2]);
    }, []);

    useEffect(() => {
        if (!runGenerateShape) {
            return;
        }

        setRunGenerateShape(false);

        for (const paramError of parameterErrors.current) {
            if (!paramError) continue;
            setSnackbarMessage(paramError);
            return;
        }

        setShapeLoading(true);
        setSnackbarMessage(null);
        renderWorker.postMessage({
            functionInputs: functionInputs,
            parameters: parameters.map((param) => param.asObject())
        });
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
                isShapeLoading={isShapeLoading}
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

