'use client';

import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Gunakan CDN untuk worker supaya gak perlu setup webpack/turbopack kompleks di Next.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfThumbnailProps {
  url: string;
  className?: string;
}

export function PdfThumbnail({ url, className }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let renderTask: ReturnType<pdfjsLib.PDFPageProxy['render']> | undefined;

    const renderPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale: 1.0 });
        
        // Kita mau thumbnail lebarnya max 240px sesuai styling thumbnail gambar
        const scale = 240 / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        console.error('Error rendering PDF thumbnail:', err);
      }
    };

    renderPdf();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [url]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        maxWidth: '240px',
        maxHeight: '160px',
        width: 'auto',
        height: 'auto',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(139, 143, 163, 0.15)',
        objectFit: 'cover',
        backgroundColor: '#fff', // Kasih background putih jaga-jaga kalau PDF transparan
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    />
  );
}
