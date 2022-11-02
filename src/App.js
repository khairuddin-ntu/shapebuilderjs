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

export default function App() {
    const [snackbarMessage, setSnackbarMessage] = useState();
    const [functionInputs, setFunctions] = useState();
    const [parameters, setParameters] = useState();
    const [renderData, setRenderData] = useState();
    const [runGenerateShape, setRunGenerateShape] = useState();

    const parameterErrors = useRef();

    useEffect(() => {
        applyTemplate(TEMPLATES[2]);
    }, []);

    useEffect(() => {
        if (!runGenerateShape) {
            return;
        }

        setRunGenerateShape(false);
        setSnackbarMessage(null);

        for (const paramError of parameterErrors.current) {
            if (!paramError) continue;
            setSnackbarMessage(paramError);
            return;
        }

        const renderWorker = new Worker(new URL("./render/RenderJob.js", import.meta.url));
        renderWorker.onmessage = (event) => {
            const renderData = event.data;
            console.log(renderData);
            setRenderData(renderData);
            setSnackbarMessage(new SnackbarSuccess("Successfully rendered shape"));
            renderWorker.terminate();
        };

        renderWorker.onerror = (err) => {
            console.error(err);
            setSnackbarMessage(new SnackbarError("Error occured while generating render data"));
            renderWorker.terminate();
        };

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

