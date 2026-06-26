'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('./Hero'), {
  ssr: false,
  loading: () => <div style={{ height: '100svh', minHeight: '100svh' }} aria-hidden="true" />,
});

export default function HeroDynamic() {
  return <Hero />;
}
