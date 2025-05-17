import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import { mutate } from 'swr';

export function useInfiniteScrollTop({
  onLoadMore,
  disabled = false,
  root = null,
  rootMargin = '0px',
  threshold = 1.0,
}: {
  onLoadMore: () => void;
  disabled?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { root, rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, disabled, root, rootMargin, threshold]);

  return sentinelRef;
}

export function useLogout() {
  const navigate = useNavigate();

  function logout() {
    // Remove the access token from local storage
    localStorage.clear();

    // Revalidate the SWR cache for the user
    mutate(() => true, null, { revalidate: false });

    // Redirect to the login page
    navigate('/login');
  }

  return logout;
}

export function useScrollToBottom(
  ref: RefObject<HTMLDivElement | null>,
  deps: Array<unknown> = [],
  behavior: ScrollBehavior = 'instant',
) {
  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior,
      });
    }
  }, [behavior, ref.current]);

  useEffect(() => {
    scrollToBottom();
  }, [...deps, scrollToBottom]);
  return { scrollToBottom };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined'
    ) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia === 'undefined'
    )
      return;

    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', documentChangeHandler);
    setMatches(mediaQueryList.matches);

    return () =>
      mediaQueryList.removeEventListener('change', documentChangeHandler);
  }, [query]);

  return matches;
}

export function usePreserveScrollOnPrepend(
  ref: React.RefObject<HTMLDivElement | null>,
  deps: Array<unknown>,
) {
  const prevScrollHeightRef = useRef<number>(0);

  // its a magic number, height of the loading component
  const LOADING_HEIGHT = 40;

  // Call this before loading more data
  const onBeforeLoadMore = () => {
    if (ref.current) {
      prevScrollHeightRef.current = ref.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (ref.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = ref.current.scrollHeight;
      if (newScrollHeight > prevScrollHeightRef.current) {
        ref.current.scrollTop =
          newScrollHeight - prevScrollHeightRef.current - LOADING_HEIGHT;
      }
      prevScrollHeightRef.current = 0;
    }
  }, [...deps, ref.current]);

  return { onBeforeLoadMore };
}
