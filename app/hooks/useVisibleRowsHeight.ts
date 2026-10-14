"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function useVisibleRowsHeight(count: number, deps: unknown[]) {
    const ref = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => {
            const row = el.children[count - 1] as HTMLElement | undefined;
            setMaxHeight(el.children.length > count && row ? row.offsetTop + row.offsetHeight : undefined);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [count, ...deps]);
    return { ref, maxHeight };
}
