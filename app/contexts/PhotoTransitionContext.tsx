"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface SourceRect {
  top: number;
  left: number;
  width: number;
  height: number;
  src: string;
  photoCount: number;
}

export interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PhotoTransitionCtx {
  source: SourceRect | null;
  setSource: (r: SourceRect | null) => void;
  targetRect: TargetRect | null;
  setTargetRect: (r: TargetRect | null) => void;
}

const Ctx = createContext<PhotoTransitionCtx>({
  source: null,
  setSource: () => {},
  targetRect: null,
  setTargetRect: () => {},
});

export function PhotoTransitionProvider({ children }: { children: ReactNode }) {
  const [source, setSourceRaw] = useState<SourceRect | null>(null);
  const [targetRect, setTargetRaw] = useState<TargetRect | null>(null);
  const setSource = useCallback((r: SourceRect | null) => setSourceRaw(r), []);
  const setTargetRect = useCallback(
    (r: TargetRect | null) => setTargetRaw(r),
    [],
  );

  return (
    <Ctx.Provider value={{ source, setSource, targetRect, setTargetRect }}>
      {children}
    </Ctx.Provider>
  );
}

export const usePhotoTransition = () => useContext(Ctx);
