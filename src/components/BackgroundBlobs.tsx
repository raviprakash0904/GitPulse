'use client';

import React from 'react';

export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Glow Blob 1 */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full filter blur-[80px] opacity-70 animate-blob"
        style={{ backgroundColor: 'var(--blob-1)', animationDelay: '0s' }}
      />
      {/* Glow Blob 2 */}
      <div 
        className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full filter blur-[100px] opacity-60 animate-blob"
        style={{ backgroundColor: 'var(--blob-2)', animationDelay: '2s' }}
      />
      {/* Glow Blob 3 */}
      <div 
        className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full filter blur-[90px] opacity-55 animate-blob"
        style={{ backgroundColor: 'var(--blob-3)', animationDelay: '4s' }}
      />
      
      {/* Abstract Design Lines or Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
