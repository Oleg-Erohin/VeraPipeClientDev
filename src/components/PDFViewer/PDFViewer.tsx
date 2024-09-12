import React, { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

interface PdfViewerProps {
  pdfBase64: string;
}

function PdfViewer({ pdfBase64 }: PdfViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scrollStart = useRef({ x: 0, y: 0 });
  const [buttons, setButtons] = useState<{ x: number; y: number }[]>([]);
  const [isPlacingButton, setIsPlacingButton] = useState(false);

  const [numPages, setNumPages] = useState<number | null>(null); // Track total pages
  const [pageNumber, setPageNumber] = useState<number>(1); // Track current page

  const base64ToBlob = (base64: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  };

  const blob = base64ToBlob(pdfBase64);
  const pdfUrl = URL.createObjectURL(blob);

  // Configure PDF.js worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages); // Set the total number of pages on PDF load
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      scrollStart.current = {
        x: scrollRef.current.scrollLeft,
        y: scrollRef.current.scrollTop,
      };
      scrollRef.current.style.cursor = "grabbing";
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
        scrollRef.current.style.cursor = "grab";
      }
    }
  };

  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (scrollRef.current) {
        scrollRef.current.style.cursor = "grab";
      }
    }
  };

  const onPdfClick = (e: React.MouseEvent) => {
    if (isPlacingButton) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setButtons([...buttons, { x, y }]);
      setIsPlacingButton(false);
    }
  };

  const addButton = () => {
    setIsPlacingButton(true);
  };

  // Function to go to the next page
  const goToNextPage = () => {
    if (pageNumber < (numPages ?? 0)) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Function to go to the previous page
  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div style={{ position: "relative", height: "600px" }}>
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          overflow: "auto",
          height: "100%",
          cursor: "grab",
          position: "relative",
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("Error loading PDF:", error)}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            onClick={onPdfClick}
          />
        </Document>

        {buttons.map((button, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: button.x,
              top: button.y,
              width: "10px",
              height: "10px",
              backgroundColor: "yellow",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
            onClick={() => alert(`Button ${index + 1} clicked!`)}
          />
        ))}
      </div>

      {/* Move the buttons container out of the scrollable area */}
      <div
        style={{
          position: "absolute",
          bottom: "20px", // Always at the bottom
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={goToPreviousPage}
          disabled={pageNumber === 1}
          style={{
            padding: "10px 20px",
            backgroundColor: pageNumber === 1 ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: pageNumber === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber === numPages}
          style={{
            padding: "10px 20px",
            backgroundColor: pageNumber === numPages ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: pageNumber === numPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>

      <button
        onClick={addButton}
        style={{
          position: "absolute",
          right: "20px",
          top: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Button
      </button>
    </div>
  );
}

export default PdfViewer;
