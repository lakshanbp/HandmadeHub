import { useEffect, useState, RefObject } from 'react';

interface Options {
  triggerOnce?: boolean;
  threshold?: number;
}

export const useSimpleInView = (ref: RefObject<HTMLElement | null>, options: Options = {}) => {
  const [inView, setInView] = useState(false);
  const { triggerOnce = true, threshold = 0.1 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, threshold, triggerOnce]);

  return { ref, inView };
}; 