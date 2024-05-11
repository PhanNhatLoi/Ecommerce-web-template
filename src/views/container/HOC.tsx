import React, { useEffect } from 'react';
import AOS from 'aos';

function HOC(props) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
    AOS.refresh();
  }, []);

  return <div>{props.children}</div>;
}

export default HOC;
