import { useRef, useState, useEffect } from "react";

export function useStateWithCallback(initialState) {
    const [state, setState] = useState(initialState);
    const callbackRef = useRef(null);

    const setStateCallback = (state, callback = null) => {
        callbackRef.current = callback; // store passed callback to ref
        setState(state);
    };

    useEffect(() => {
        if (!callbackRef.current) {
            return;
        }

        callbackRef.current(state);
        callbackRef.current = null; // reset callback
    }, [state]);

    return [state, setStateCallback];
}
