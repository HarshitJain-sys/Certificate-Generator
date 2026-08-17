import { forwardRef, useEffect, useRef, useState } from "react";
import CertificateTemplate, { CERT_WIDTH, CERT_HEIGHT } from "./CertificateTemplate";

interface CertificatePreviewProps {
  fullName: string;
}

/**
 * Wraps CertificateTemplate (always rendered at its native 720x540, matching
 * the original certificate exactly) and scales it down with CSS to fit the
 * available panel width, so what's on screen is exactly what gets exported.
 */
const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ fullName }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const updateScale = () => {
        const width = el.clientWidth;
        setScale(width > 0 ? width / CERT_WIDTH : 1);
      };

      updateScale();
      const observer = new ResizeObserver(updateScale);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div ref={containerRef} className="w-full">
        <div
          style={{
            width: "100%",
            height: CERT_HEIGHT * scale,
            position: "relative",
            overflow: "hidden",
            borderRadius: 8,
          }}
          className="shadow-lg ring-1 ring-black/10"
        >
          <div
            style={{
              width: CERT_WIDTH,
              height: CERT_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <CertificateTemplate ref={ref} fullName={fullName} />
          </div>
        </div>
      </div>
    );
  },
);

CertificatePreview.displayName = "CertificatePreview";

export default CertificatePreview;
