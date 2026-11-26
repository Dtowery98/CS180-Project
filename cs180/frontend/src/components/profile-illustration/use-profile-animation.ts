import { useEffect, useState } from "react";
import { useAnimate, useReducedMotion, type AnimationSequence } from "motion/react";

export type ProfileIllustrationProps = {
    active: boolean;
    activation: number;
    selected: boolean;
};

export function useProfileAnimation(activation: number, selected: boolean, createSequence: (selected: boolean) => AnimationSequence) {
    const reduceMotion = useReducedMotion();
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const [restoredActivation, setRestoredActivation] = useState(0);
    const readyForHover = activation === 0 || (!selected && restoredActivation === activation);

    useEffect(() => {
        if (activation === 0) return;

        // Interrupt the previous timeline when selection changes.
        const playback = animate(createSequence(selected), reduceMotion ? { duration: 0 } : undefined);
        let cancelled = false;
        void playback.then(() => {
            if (!cancelled && !selected) setRestoredActivation(activation);
        });
        return () => {
            cancelled = true;
            playback.stop();
        };
    }, [activation, selected, createSequence, reduceMotion, animate]);

    return { scope, reduceMotion, readyForHover };
}
