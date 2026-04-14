"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePhotoTransition } from "../contexts/PhotoTransitionContext";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useMemo } from "react";

/** Rough estimate used while the detail page hasn't mounted yet. */
function estimateHeroRect(photoCount: number) {
  const vw = window.innerWidth;
  const mainWidth = Math.min(vw, 1152);
  const mainLeft = (vw - mainWidth) / 2;
  const contentLeft = mainLeft + 24;
  const contentWidth = mainWidth - 48;
  const gap = 6;
  const multi = photoCount > 1;
  const coverWidth = multi ? (contentWidth - gap) / 2 : contentWidth;
  const coverHeight = multi ? 440 : coverWidth * (7 / 16);
  return {
    top: 156,
    left: contentLeft,
    width: coverWidth,
    height: coverHeight,
  };
}

/**
 * Fixed-position overlay that animates the listing card photo
 * from its card position to the detail-page hero position.
 *
 * 1. INSTANT — appears at card center, cropped to hero aspect ratio.
 * 2. SPRING — expands to an estimated hero rect immediately.
 * 3. When the detail page mounts and reports its real hero DOMRect
 *    via context, the animate target updates → motion smoothly
 *    settles into the exact position (pixel-perfect).
 */
export default function PhotoTransitionOverlay() {
  const { source, setSource, targetRect } = usePhotoTransition();
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPath.current && source) {
      prevPath.current = pathname;
      const timer = setTimeout(() => setSource(null), 450);
      return () => clearTimeout(timer);
    }
    prevPath.current = pathname;
  }, [pathname, source, setSource]);

  /* Initial rect: hero aspect ratio fitted inside the card bounds. */
  const initial = useMemo(() => {
    if (!source) return null;
    const est = estimateHeroRect(source.photoCount);
    const heroAR = est.width / est.height;

    let iw: number, ih: number;
    if (source.width / source.height > heroAR) {
      ih = source.height;
      iw = ih * heroAR;
    } else {
      iw = source.width;
      ih = iw / heroAR;
    }

    const cx = source.left + source.width / 2;
    const cy = source.top + source.height / 2;

    return {
      top: cy - ih / 2,
      left: cx - iw / 2,
      width: iw,
      height: ih,
      borderRadius: 12,
    };
  }, [source]);

  /* Target: use the real measured rect from the detail page when
     available; otherwise fall back to the estimate. */
  const target = useMemo(() => {
    if (!source) return null;
    const rect = targetRect ?? estimateHeroRect(source.photoCount);
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: 16,
    };
  }, [source, targetRect]);

  return (
    <AnimatePresence>
      {source && initial && target && (
        <motion.div
          key="photo-fly"
          style={{
            position: "fixed",
            zIndex: 9999,
            overflow: "hidden",
            pointerEvents: "none",
            willChange: "transform",
          }}
          initial={initial}
          animate={target}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 30,
            mass: 0.9,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={source.src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
