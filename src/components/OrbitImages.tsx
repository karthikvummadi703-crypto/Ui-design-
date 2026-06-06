import React, { useMemo, useEffect, useLayoutEffect, useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate, MotionValue } from 'motion/react';
import { useOrbitDrag } from '../hooks/useOrbitDrag';
import {
  generateCirclePath,
  generateEllipsePath,
  generateSquarePath,
  generateRectanglePath,
  generateTrianglePath,
  generateStarPath,
  generateHeartPath,
  generateInfinityPath,
  generateWavePath
} from '../utils/pathGenerators';
import './OrbitImages.css';

interface OrbitItemProps {
  key?: React.Key;
  item: ReactNode;
  index: number;
  totalItems: number;
  path: string;
  itemSize: number;
  rotation: number;
  progress: MotionValue<number>;
  fill: boolean;
}

function OrbitItem({ item, index, totalItems, path, itemSize, rotation, progress, fill }: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;

  const offsetDistance = useTransform(progress, (p: number) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });

  return (
    <motion.div
      className="orbit-item"
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        offsetDistance,
      }}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>{item}</div>
    </motion.div>
  );
}

interface OrbitImagesProps {
  images?: string[];
  altPrefix?: string;
  shape?: 'circle' | 'ellipse' | 'square' | 'rectangle' | 'triangle' | 'star' | 'heart' | 'infinity' | 'wave' | 'custom';
  customPath?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  starPoints?: number;
  starInnerRatio?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  direction?: 'normal' | 'reverse';
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  easing?: string;
  paused?: boolean;
  centerContent?: ReactNode;
  responsive?: boolean;
  onTrackPosition?: (pos: { x: number; y: number }) => void;
  activeIndex?: number;
  onActiveItemChange?: (index: number) => void;
}

export default function OrbitImages({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  width = 100,
  height = 100,
  className = '',
  showPath = false,
  pathColor = 'rgba(0,0,0,0.1)',
  pathWidth = 2,
  easing = 'linear',
  paused = false,
  centerContent,
  responsive = false,
  onTrackPosition,
  activeIndex = 0,
  onActiveItemChange,
}: OrbitImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case 'circle':
        return generateCirclePath(designCenterX, designCenterY, radius);
      case 'ellipse':
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
      case 'square':
        return generateSquarePath(designCenterX, designCenterY, radius * 2);
      case 'rectangle':
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'triangle':
        return generateTrianglePath(designCenterX, designCenterY, radius * 2);
      case 'star':
        return generateStarPath(designCenterX, designCenterY, radius, radius * starInnerRatio, starPoints);
      case 'heart':
        return generateHeartPath(designCenterX, designCenterY, radius * 2);
      case 'infinity':
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'wave':
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3);
      case 'custom':
        return customPath || generateCirclePath(designCenterX, designCenterY, radius);
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
    }
  }, [shape, customPath, designCenterX, designCenterY, radiusX, radiusY, radius, starPoints, starInnerRatio]);

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.clientWidth / baseWidth);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);

  // In-memory path element helper to calculate point positions dynamically along any SVG geometry
  const parsedPath = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", path);
      return {
        element: p,
        totalLength: p.getTotalLength()
      };
    } catch (e) {
      return null;
    }
  }, [path]);

  // Track position periodically and invoke the coordinate mapping callback
  useEffect(() => {
    if (!onTrackPosition || !parsedPath) return;

    const unsubscribe = progress.on("change", (latest) => {
      // Offset progress by activeIndex to track the highlighted bubble's coordinate
      const itemOffset = fill && images.length > 0 ? (activeIndex / images.length) * 100 : 0;
      const normalizedProgress = (((latest + itemOffset) % 100) + 100) % 100;
      const distance = (normalizedProgress / 100) * parsedPath.totalLength;
      try {
        const pt = parsedPath.element.getPointAtLength(distance);
        
        const dx = pt.x - designCenterX;
        const dy = pt.y - designCenterY;
        
        const normX = dx / (baseWidth / 2);
        const normY = dy / (baseWidth / 2);
        
        const angleRad = (rotation * Math.PI) / 180;
        const rotX = normX * Math.cos(angleRad) - normY * Math.sin(angleRad);
        const rotY = normX * Math.sin(angleRad) + normY * Math.cos(angleRad);
        
        // Feed into standard Cartesian viewport range [-1, 1] for 3D synchronization
        onTrackPosition({ x: rotX, y: -rotY });
      } catch (err) {
        // Safe failover
      }
    });

    return () => unsubscribe();
  }, [progress, parsedPath, onTrackPosition, rotation, designCenterX, designCenterY, baseWidth, activeIndex, fill, images.length]);

  useEffect(() => {
    if (isDragging.current || images.length === 0) return;
    
    const focalPoint = 75;
    const targetProgress = focalPoint - (activeIndex / images.length) * 100;
    
    // Extreme high-speed spring snapping animation representing instant orbital acceleration
    const animControls = animate(progress, targetProgress, {
      type: 'spring',
      stiffness: 850, 
      damping: 38,
    });
    
    return () => animControls.stop();
  }, [activeIndex, images.length, progress]);

  // Remove the linear autoscroll as the system is now step-based
  useEffect(() => {
    // No continuous autoplay is required here as the parent guides the steps.
  }, []);

  const {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useOrbitDrag({
    progress,
    direction,
    onActiveItemChange,
    imagesLength: images.length,
    containerRef,
  });

  const containerWidth = responsive ? '100%' : (typeof width === 'number' ? width : '100%');
  const containerHeight = responsive ? 'auto' : (typeof height === 'number' ? height : (typeof width === 'number' ? width : 'auto'));

  const items = images.map((src, index) => {
    const isActive = index === activeIndex;
    const itemGlowColor = pathColor || '#6366f1';
    return (
      <div 
        key={src} 
        className="w-full h-full relative" 
        style={{ 
          '--glow-color': itemGlowColor,
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none',
          transform: isActive ? 'scale(1.2)' : 'scale(0.3)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        } as React.CSSProperties}
      >
        <motion.img
          src={src}
          alt={`${altPrefix} ${index + 1}`}
          draggable={false}
          className="orbit-image select-none pointer-events-none"
          animate={isActive ? {
            rotate: [360, 0],
            scale: 1.25,
            filter: `drop-shadow(0 0 32px ${itemGlowColor})`,
          } : {
            rotate: 0,
            scale: 0.3,
            filter: 'none',
          }}
          transition={{
            rotate: { type: 'spring', stiffness: 500, damping: 22 },
            scale: { duration: 0.5, ease: 'easeOut' },
          }}
          style={{
            border: `3px solid ${itemGlowColor}`,
            borderRadius: '9999px',
            backgroundColor: 'rgba(2, 6, 23, 0.95)',
            boxShadow: `0 0 50px rgba(2, 6, 23, 0.98), inset 0 0 30px ${itemGlowColor}40`,
            padding: '12px',
          }}
        />
        {isActive && (
          <>
            {/* Bounce state pointer */}
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center p-0.5 shadow-2xl border animate-bounce z-25" 
              style={{ 
                backgroundColor: '#020617', 
                borderColor: itemGlowColor 
              }}
            >
              <div 
                className="w-full h-full rounded-full animate-ping absolute opacity-60"
                style={{ backgroundColor: itemGlowColor }}
              />
              <div 
                className="w-full h-full rounded-full" 
                style={{ backgroundColor: itemGlowColor }}
              />
            </div>

            {/* Glowing orbital ring accent */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed animate-spin pointer-events-none"
              style={{ 
                borderColor: `${itemGlowColor}33`, 
                animationDuration: '25s',
                margin: '-14px' 
              }}
            />
          </>
        )}
      </div>
    );
  });

  return (
    <div
      ref={containerRef}
      className={`orbit-container cursor-grab active:cursor-grabbing ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? '1 / 1' : undefined,
        touchAction: 'none',
      }}
      aria-hidden="true"
    >
      <div
        className={responsive ? 'orbit-scaling-container orbit-scaling-container--responsive' : 'orbit-scaling-container'}
        style={{
          width: responsive ? baseWidth : '100%',
          height: responsive ? baseWidth : '100%',
          transform: responsive && scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
          visibility: responsive && scale === null ? 'hidden' : undefined,
        }}
      >
        <div
          className="orbit-rotation-wrapper"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="orbit-path-svg"
            >
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth / (scale ?? 1)} />
            </svg>
          )}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
            />
          ))}
        </div>
      </div>

      {centerContent && (
        <div className="orbit-center-content">
          {centerContent}
        </div>
      )}
    </div>
  );
}
