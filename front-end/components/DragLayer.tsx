'use client';

import { useDragLayer } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { useEffect, useRef } from 'react';
import React from 'react';



export function DragLayer() {

    // const { setDragging } = useDragStore();

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  const rafId = useRef<number | null>(null);
  const scrollDuration = useRef<number>(0); // Track time in scroll zone for acceleration

  useEffect(() => {
    if (!isDragging || !currentOffset) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      scrollDuration.current = 0;
      return;
    }

    const scrollZoneSize = 100; // Increased for mobile sensitivity (pixels from edge)
    const baseScrollSpeed = 30; // Base speed for mobile responsiveness
    const maxScrollSpeed = 60; // Maximum speed after acceleration
    const accelerationRate = 0.05; // Speed increase per frame

    const getScrollContainer = () => {
      const columns = document.querySelectorAll('[data-column]');
      const parentContainer = document.querySelector('[data-scroll-container="tasks-parent"]') as HTMLElement | null;
      const { x, y } = currentOffset;

      // Adjust for page scroll offset
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const adjustedX = x + scrollX;
      const adjustedY = y + scrollY;

      // console.log('Drag coordinates:', { x: adjustedX, y: adjustedY });

      // Check columns first
      for (const column of columns) {
        const rect = column.getBoundingClientRect();
        // console.log('Column rect:', {
        //   id: column.getAttribute('data-column'),
        //   left: rect.left + scrollX,
        //   right: rect.right + scrollX,
        //   top: rect.top + scrollY,
        //   bottom: rect.bottom + scrollY,
        // });

        if (
          adjustedX >= rect.left + scrollX &&
          adjustedX <= rect.right + scrollX &&
          adjustedY >= rect.top + scrollY &&
          adjustedY <= rect.bottom + scrollY
        ) {
          return column as HTMLElement;
        }
      }

      if (parentContainer) {
        // const rect = parentContainer.getBoundingClientRect();
        // console.log('Parent container rect:', {
        //   left: rect.left + scrollX,
        //   right: rect.right + scrollX,
        //   top: rect.top + scrollY,
        //   bottom: rect.bottom + scrollY,
        // });
        return parentContainer;
      }

      return null;
    };

    const scrollContainer = getScrollContainer();

    if (!scrollContainer) {
      console.warn('No scrollable container found');
      scrollDuration.current = 0;
      return;
    }

    // console.log('Scrolling container:', scrollContainer.getAttribute('data-column') || 'Parent container');

    const scroll = () => {
      const rect = scrollContainer.getBoundingClientRect();
      const { y } = currentOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const adjustedY = y + scrollY;

      // Calculate relative Y position within the scroll container
      const relativeY = adjustedY - (rect.top + scrollY);

      // Calculate dynamic scroll speed based on time in scroll zone
      const dynamicScrollSpeed = Math.min(baseScrollSpeed + scrollDuration.current * accelerationRate, maxScrollSpeed);

      console.log('Scroll info:', {
        relativeY,
        containerHeight: rect.height,
        scrollTop: scrollContainer.scrollTop,
        scrollHeight: scrollContainer.scrollHeight,
        scrollSpeed: dynamicScrollSpeed,
      });

      let isInScrollZone = false;

      if (relativeY > rect.height - scrollZoneSize && scrollContainer.scrollTop < scrollContainer.scrollHeight - rect.height) {
        // Scroll down
        scrollContainer.scrollBy(0, dynamicScrollSpeed);
        isInScrollZone = true;
      } else if (relativeY < scrollZoneSize && scrollContainer.scrollTop > 0) {
        // Scroll up
        scrollContainer.scrollBy(0, -dynamicScrollSpeed);
        isInScrollZone = true;
      }

      // Increment scroll duration if in scroll zone, reset otherwise
      scrollDuration.current = isInScrollZone ? scrollDuration.current + 1 : 0;

      rafId.current = requestAnimationFrame(scroll);
    };

    rafId.current = requestAnimationFrame(scroll);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      scrollDuration.current = 0;
    };
  }, [isDragging, currentOffset]);

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('dragging');
    } else {
      document.body.classList.remove('dragging');
    }
    return () => {
      document.body.classList.remove('dragging');
    };
  }, [isDragging]);

  if (!isDragging || !currentOffset) {
    return null;
  }

  const { x, y } = currentOffset;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        zIndex: 10000,
        pointerEvents: 'none',
        width: '100%',
        maxWidth: '310px',
      }}
    >
      <TaskCard
        title={item.title}
        priority={item.priority}
        duedate={item.duedate}
        status={item.status}
        category={item.category}
        id={item.id}
        moveTask={() => {}}
        isDragging={true}
        description={item.description}
        onEdit={() => Promise.resolve()}
        onDelete={() => Promise.resolve()}
      /> *
    </div>
  );
}