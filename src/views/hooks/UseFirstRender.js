import { useEffect, useRef } from 'react';

function useFirstRender() {
  const ref = useRef(true);
  useEffect(() => {
    ref.current = false;
  }, []);
  return ref.current;
}

export default useFirstRender;
