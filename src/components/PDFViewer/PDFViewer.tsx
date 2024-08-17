import React, { useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

interface PdfViewerProps {
    pdfBase64: string;
}

function PdfViewer({ pdfBase64 }: PdfViewerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const scrollStart = useRef({ x: 0, y: 0 });

    const base64ToBlob = (base64: string): Blob => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'application/pdf' });
    };

    const blob = base64ToBlob(pdfBase64);
    const pdfUrl = URL.createObjectURL(blob);

    // Configure PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const onMouseDown = (e: React.MouseEvent) => {
        if (scrollRef.current) {
            isDragging.current = true;
            dragStart.current = { x: e.clientX, y: e.clientY };
            scrollStart.current = {
                x: scrollRef.current.scrollLeft,
                y: scrollRef.current.scrollTop,
            };
            scrollRef.current.style.cursor = 'grabbing';
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current && scrollRef.current) {
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            scrollRef.current.scrollLeft = scrollStart.current.x - dx;
            scrollRef.current.scrollTop = scrollStart.current.y - dy;
        }
    };

    const onMouseUp = () => {
        if (isDragging.current) {
            isDragging.current = false;
            if (scrollRef.current) {
                scrollRef.current.style.cursor = 'grab';
            }
        }
    };

    const onMouseLeave = () => {
        if (isDragging.current) {
            isDragging.current = false;
            if (scrollRef.current) {
                scrollRef.current.style.cursor = 'grab';
            }
        }
    };

    return (
        <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            style={{
                height: '600px',
                border: '1px solid rgba(0, 0, 0, 0.3)',
                overflow: 'auto',
                cursor: 'grab',
                position: 'relative',
            }}
        >
            <Document
                file={pdfUrl}
                onLoadError={(error) => console.error('Error loading PDF:', error)}
            >
                <Page pageNumber={1} renderTextLayer={false}/>
            </Document>
        </div>
    );
}

export default PdfViewer;
