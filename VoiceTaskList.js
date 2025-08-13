import { useEffect, useRef, useCallback } from "react";

const useVoiceTaskList = (onCommandDetected) => {
    const recogRef = useRef(null);

    useEffect(() => {
        const SpeechRecog = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecog) {
            alert("Speech Recognition not supported in this browser.");
            return;
        }

        recogRef.current = new SpeechRecog();
        recogRef.current.continuous = true;
        recogRef.current.lang = 'en-US';

        recogRef.current.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript.toLowerCase().startsWith("add task")) {
                const task = transcript.slice(9).trim();
                if (task) {
                    onCommandDetected(task);
                }
            }
        };
    }, [onCommandDetected]);

    const start = useCallback(() => {
        if (recogRef.current) recogRef.current.start();
    }, []);

    const stop = useCallback(() => {
        if (recogRef.current) recogRef.current.stop();
    }, []);

    return { start, stop };
};

export default useVoiceTaskList;
