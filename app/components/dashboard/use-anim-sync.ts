"use client";

import { useState, useEffect } from "react";

export const COUNT_MS = 2000;
export const HOLD_MS  = 10000;
export const RESET_MS = 400;

type Listener = (active: boolean) => void;
const listeners = new Set<Listener>();
let globalActive = false;
let started = false;

function startCycle() {
    if (started) return;
    started = true;

    const cycle = () => {
        globalActive = true;
        listeners.forEach((l) => l(true));

        setTimeout(() => {
            globalActive = false;
            listeners.forEach((l) => l(false));
            setTimeout(cycle, RESET_MS);
        }, COUNT_MS + HOLD_MS);
    };

    setTimeout(cycle, 120);
}

export function useAnimSync(): boolean {
    const [active, setActive] = useState(false);

    useEffect(() => {
        startCycle();
        const cb: Listener = (a) => setActive(a);
        listeners.add(cb);
        setActive(globalActive);
        return () => { listeners.delete(cb); };
    }, []);

    return active;
}
