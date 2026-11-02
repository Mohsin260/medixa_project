'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import styles from './ProductGallery.module.css';
import { useProductSelection } from './ProductSelection';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const STEP = 0.5;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badge?: string;
}

interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

interface ThumbScrollState {
  left: boolean;
  right: boolean;
}

export default function ProductGallery({ images, alt, badge }: ProductGalleryProps) {
  const selection = useProductSelection();
  const galleryImages: string[] = useMemo(
    () => (images?.length ? images : []),
    [images],
  );
  const colorStartIndex = selection?.colorImages?.[selection.color]?.[0]
    ? galleryImages.indexOf(selection.colorImages[selection.color][0])
    : -1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState<ZoomState>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [thumbScroll, setThumbScroll] = useState<ThumbScrollState>({ left: false, right: false });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  const clampOffset = useCallback(
    (nextOffset: { x: number; y: number }, nextScale: number): { x: number; y: number } => {
      const viewport = viewportRef.current;
      if (!viewport || nextScale <= 1) {
        return { x: 0, y: 0 };
      }
      const maxX = (viewport.clientWidth * (nextScale - 1)) / 2;
      const maxY = (viewport.clientHeight * (nextScale - 1)) / 2;
      return {
        x: clamp(nextOffset.x, -maxX, maxX),
        y: clamp(nextOffset.y, -maxY, maxY),
      };
    },
    [],
  );

  const resetZoom = useCallback(() => {
    setZoom({ scale: 1, x: 0, y: 0 });
    dragRef.current = null;
    setDragging(false);
  }, []);

  const [prevGallery, setPrevGallery] = useState<string[]>(galleryImages);
  if (galleryImages !== prevGallery) {
    setPrevGallery(galleryImages);
    setActiveIndex(0);
    setZoom({ scale: 1, x: 0, y: 0 });
    setDragging(false);
  }

  const [prevColorStart, setPrevColorStart] = useState(colorStartIndex);
  if (colorStartIndex !== prevColorStart) {
    setPrevColorStart(colorStartIndex);
    if (colorStartIndex >= 0) {
      setActiveIndex(colorStartIndex);
      setZoom({ scale: 1, x: 0, y: 0 });
      setDragging(false);
    }
  }

  const updateThumbScroll = useCallback(() => {
    const track = thumbsRef.current;
    if (!track) {
      return;
    }
    setThumbScroll({
      left: track.scrollLeft > 1,
      right: track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    });
  }, []);

  const scrollThumbIntoView = useCallback((index: number) => {
    const track = thumbsRef.current;
    const target = track?.children?.[index] as HTMLElement | undefined;
    if (!track || !target) {
      return;
    }
    const targetLeft = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (colorStartIndex < 0) {
      return;
    }
    dragRef.current = null;
    scrollThumbIntoView(colorStartIndex);
  }, [colorStartIndex, scrollThumbIntoView]);

  useEffect(() => {
    const track = thumbsRef.current;
    if (!track) {
      return undefined;
    }

    dragRef.current = null;
    updateThumbScroll();
    track.addEventListener('scroll', updateThumbScroll, { passive: true });
    window.addEventListener('resize', updateThumbScroll);

    return () => {
      track.removeEventListener('scroll', updateThumbScroll);
      window.removeEventListener('resize', updateThumbScroll);
    };
  }, [galleryImages, updateThumbScroll]);

  const scrollThumbs = (direction: number) => {
    const track = thumbsRef.current;
    if (!track) {
      return;
    }
    const step = (track.querySelector('button')?.offsetWidth || 76) + 10;
    track.scrollBy({ left: direction * step * 3, behavior: 'smooth' });
  };

  const showImage = (direction: number) => {
    if (galleryImages.length < 2) {
      return;
    }
    const nextIndex =
      (activeIndex + direction + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIndex);
    scrollThumbIntoView(nextIndex);
    resetZoom();
  };

  const zoomTo = useCallback(
    (nextScale: number) => {
      setZoom((current) => {
        const scale = clamp(Number(nextScale.toFixed(2)), MIN_SCALE, MAX_SCALE);
        const offset = scale === 1 ? { x: 0, y: 0 } : clampOffset(current, scale);
        return { scale, x: offset.x, y: offset.y };
      });
    },
    [clampOffset],
  );

  const changeScale = useCallback(
    (delta: number) => {
      setZoom((current) => {
        const scale = clamp(Number((current.scale + delta).toFixed(2)), MIN_SCALE, MAX_SCALE);
        const offset = scale === 1 ? { x: 0, y: 0 } : clampOffset(current, scale);
        return { scale, x: offset.x, y: offset.y };
      });
    },
    [clampOffset],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      changeScale(event.deltaY < 0 ? STEP : -STEP);
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [changeScale]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom.scale <= 1) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: zoom.x,
      originY: zoom.y,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) {
      return;
    }
    const nextOffset = {
      x: dragRef.current.originX + (event.clientX - dragRef.current.startX),
      y: dragRef.current.originY + (event.clientY - dragRef.current.startY),
    };
    const offset = clampOffset(nextOffset, zoom.scale);
    setZoom((current) => ({ ...current, x: offset.x, y: offset.y }));
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
      setDragging(false);
    }
  };

  const handleDoubleClick = () => {
    if (zoom.scale > 1) {
      resetZoom();
    } else {
      zoomTo(2);
    }
  };

  const activeImage = galleryImages[activeIndex] || galleryImages[0];

  return (
    <div className={styles.gallery}>
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${zoom.scale > 1 ? styles.viewportZoomed : ''} ${
          dragging ? styles.viewportDragging : ''
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={handleDoubleClick}
        role="region"
        aria-label={`${alt} image gallery`}
      >
        {badge ? <span className={styles.badge}>{badge}</span> : null}

        <img
          key={activeImage}
          src={activeImage}
          alt={alt}
          className={styles.image}
          draggable={false}
          style={{
            transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
            transition: dragging ? 'none' : undefined,
          }}
        />

        {galleryImages.length > 1 ? (
          <>
            <button
              type="button"
              className={`${styles.imageNav} ${styles.imageNavPrev}`}
              onPointerDown={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                showImage(-1);
              }}
              aria-label="Previous image"
              title="Previous image"
            >
              <i className="fa fa-chevron-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.imageNav} ${styles.imageNavNext}`}
              onPointerDown={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                showImage(1);
              }}
              aria-label="Next image"
              title="Next image"
            >
              <i className="fa fa-chevron-right" aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div className={styles.zoomControls} role="group" aria-label="Image zoom controls">
          <button
            type="button"
            className={styles.zoomButton}
            onClick={() => changeScale(-STEP)}
            disabled={zoom.scale <= MIN_SCALE}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <i className="fa fa-search-minus" aria-hidden="true" />
          </button>
          <span className={styles.zoomLevel} aria-live="polite">
            {Math.round(zoom.scale * 100)}%
          </span>
          <button
            type="button"
            className={styles.zoomButton}
            onClick={() => changeScale(STEP)}
            disabled={zoom.scale >= MAX_SCALE}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <i className="fa fa-search-plus" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.zoomButton}
            onClick={resetZoom}
            disabled={zoom.scale === MIN_SCALE}
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <i className="fa fa-compress" aria-hidden="true" />
          </button>
        </div>

        <p className={styles.hint}>
          {zoom.scale > 1
            ? 'Drag to move · double-click to reset'
            : 'Scroll or use + / − to zoom'}
        </p>
      </div>

      <div className={styles.thumbsWrap}>
        <button
          type="button"
          className={styles.thumbNav}
          onClick={() => scrollThumbs(-1)}
          disabled={!thumbScroll.left}
          aria-label="Scroll thumbnails left"
          title="Previous images"
        >
          <i className="fa fa-chevron-left" aria-hidden="true" />
        </button>

        <div ref={thumbsRef} className={styles.thumbs}>
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => {
                setActiveIndex(index);
                resetZoom();
              }}
              aria-label={`View image ${index + 1} of ${galleryImages.length}`}
              aria-pressed={index === activeIndex}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.thumbNav}
          onClick={() => scrollThumbs(1)}
          disabled={!thumbScroll.right}
          aria-label="Scroll thumbnails right"
          title="More images"
        >
          <i className="fa fa-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
