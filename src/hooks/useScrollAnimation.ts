import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>(threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

export const useParallax = (speed = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);
  
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const direction = currentScrollY > lastScrollY ? 1 : -1;
      lastScrollY = currentScrollY;
      setOffsetY(currentScrollY * speed * direction);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return offsetY;
};