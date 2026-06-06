/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, RefObject } from 'react';
import { MotionValue, animate } from 'motion/react';

interface UseOrbitDragProps {
  progress: MotionValue<number>;
  direction: 'normal' | 'reverse';
  onActiveItemChange?: (index: number) => void;
  imagesLength: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useOrbitDrag({
  progress,
  direction,
  onActiveItemChange,
  imagesLength,
  containerRef,
}: UseOrbitDragProps) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startProgress = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startProgress.current = progress.get();
    
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    
    // Horizontal dragging of ~450px translates to a full rotation cycle
    const dragScaleFactor = 450;
    const deltaProgress = (deltaX / dragScaleFactor) * 100;
    
    const nextVal = startProgress.current + (direction === 'reverse' ? -deltaProgress : deltaProgress);
    progress.set(nextVal);

    // Call onActiveItemChange dynamically as the carousel slides
    if (onActiveItemChange && imagesLength > 0) {
      const focalPoint = 75; // Forefront of ellipse path projection
      const rawIndex = ((focalPoint - nextVal) / 100) * imagesLength;
      let index = Math.round(rawIndex) % imagesLength;
      if (index < 0) {
        index += imagesLength;
      }
      onActiveItemChange(index);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);

    // Snapping logic: animate progress to align with the nearest item exactly!
    if (imagesLength > 0) {
      const currentVal = progress.get();
      const focalPoint = 75;
      
      const rawIndex = ((focalPoint - currentVal) / 100) * imagesLength;
      let index = Math.round(rawIndex) % imagesLength;
      if (index < 0) {
        index += imagesLength;
      }

      // Compute snapped progress value corresponding exactly to this index
      const snappedProgress = focalPoint - (index / imagesLength) * 100;
      
      animate(progress, snappedProgress, {
        type: 'spring',
        stiffness: 850,
        damping: 38,
        onComplete: () => {
          if (onActiveItemChange) {
            onActiveItemChange(index);
          }
        }
      });
    }
  };

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
