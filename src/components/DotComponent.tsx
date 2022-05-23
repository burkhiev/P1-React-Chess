import React from 'react';
import classNames from 'classnames';

import '../css/components/dot.css';

function getDotCss() {
  return {
    'position-absolute': true,
    'translate-middle': true,
    'top-50': true,
    'start-50': true,
    dot: true,
  };
}

export default function DotComponent() {
  const dotCss = classNames(getDotCss());

  return (
    <div className={dotCss} />
  );
}
