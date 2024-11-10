import React, { lazy, Suspense } from 'react';

const LazyCropper = lazy(() => import('./Cropper'));

const Cropper = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCropper {...props} />
  </Suspense>
);

export default Cropper;
