import { useEffect, useRef, useState } from 'react';

function UseHeightElement() {
  const [height, setHeight] = useState(0);
  const ref = useRef();
  useEffect(() => {
    setHeight(ref?.current?.offsetHeight || 500);
  });
  return [height, ref];
}

export default UseHeightElement;
