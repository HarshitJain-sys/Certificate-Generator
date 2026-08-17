import { forwardRef } from "react";
import dpguLogo from "../assets/dpgu-logo.png";
import acmLogo from "../assets/acm-logo.jpg";
import signature from "../assets/signature.jpg";
import bhalkeSignatureBlock from "../assets/bhalke-signature.png";

interface CertificateTemplateProps {
  fullName: string;
}

// Fixed details that belong to the source certificate itself (not part of the
// participant's form) — only the name is editable, everything else is
// reproduced exactly as in the uploaded "Certificate of Participation" PDF.
const CHAPTER_LABEL = "DPGU ACM STUDENT CHAPTER";
const TITLE = "Certificate of Participation";
const CERTIFY_LINE = "This is to certify that";
const PARTICIPATION_LINE = "has actively participated in the workshop";
const WORKSHOP_TITLE = "Pixel To Prototype :  Hands-On Figma Workshop";
const VENUE_LINE = "Organized on August 10, 2026, at the School of Technology and Research, DPGU";
const COORDINATOR_NAME = "Prof. Shabana T Pirjade";
const COORDINATOR_TITLE = "ACM Faculty Coordinator";

// Native size matches the uploaded certificate PDF exactly (720x540pt), so
// nothing is stretched, re-proportioned, or repositioned. Every absolute
// top/left value below was extracted directly from that PDF's text spans,
// image placement rects, and vector drawings — not eyeballed.
export const CERT_WIDTH = 720;
export const CERT_HEIGHT = 540;

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ fullName }, ref) => {
    const displayName = fullName.trim() || "{{Full Name}}";

    return (
      <div
        ref={ref}
        className="relative bg-white text-black"
        style={{ width: CERT_WIDTH, height: CERT_HEIGHT, fontFamily: "'Balthazar', Georgia, serif" }}
      >
        {/* outer border, matches the traced border box exactly */}
        <div
          className="absolute border-[1.5px]"
          style={{ left: 20.8, top: 14.9, right: 16, bottom: 14.9, borderColor: "#7c93b3" }}
        />
        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <CornerMark key={corner} corner={corner} />
        ))}

        {/* header logos */}
        <img
          src={dpguLogo}
          alt="DPGU"
          className="absolute object-contain"
          style={{ left: 119.2, top: 43.2, width: 447.5, height: 62.4 }}
        />
        <img
          src={acmLogo}
          alt="ACM DPGU"
          className="absolute object-contain"
          style={{ left: 566.7, top: 36, width: 90, height: 90 }}
        />

        <Line top={137.8} fontSize={12} weight={700} letterSpacing={0.5}>
          {CHAPTER_LABEL}
        </Line>

        <Line top={166.6} fontSize={36} weight={600} font="title" lineHeight={1.2}>
          {TITLE}
        </Line>

        <Line top={226.1} fontSize={11} weight={400}>
          {CERTIFY_LINE}
        </Line>

        <Line top={252.1} fontSize={14} weight={400}>
          {displayName}
        </Line>

        <Line top={298} fontSize={14} weight={400}>
          {PARTICIPATION_LINE}
        </Line>

        <Line top={314.8} fontSize={14} weight={700}>
          {WORKSHOP_TITLE}
        </Line>

        <Line top={351.2} fontSize={12} weight={400}>
          {VENUE_LINE}
        </Line>

        {/* left signature block — Faculty Coordinator */}
        <img
          src={signature}
          alt="Signature"
          className="absolute object-contain"
          style={{ left: 103.97, top: 398.75, width: 96.75, height: 57.75 }}
        />
        <div
          className="absolute border-t border-black"
          style={{ left: 46.5, top: 471.28, width: 261.37 - 46.5 }}
        />
        <Line top={475.5} fontSize={12} weight={700} left={46.5} width={261.37 - 46.5}>
          {COORDINATOR_NAME}
        </Line>
        <Line top={489.9} fontSize={12} weight={400} left={46.5} width={261.37 - 46.5}>
          {COORDINATOR_TITLE}
        </Line>

        {/* right signature block — Director. Reproduced as a single image
            (signature + underline + name + title), exactly as it is
            embedded as one flattened graphic in the source PDF. */}
        <img
          src={bhalkeSignatureBlock}
          alt="Dr. D. G. Bhalke, Director — signature"
          className="absolute object-contain"
          style={{ left: 460.97, top: 398.75, width: 203.67, height: 106.23 }}
        />
      </div>
    );
  },
);

CertificateTemplate.displayName = "CertificateTemplate";

const FONT_STACKS: Record<string, string> = {
  body: "'Balthazar', Georgia, serif",
  title: "'EB Garamond', Georgia, serif",
};

function Line({
  top,
  fontSize,
  weight = 400,
  font = "body",
  letterSpacing,
  lineHeight,
  left = 0,
  width,
  children,
}: {
  top: number;
  fontSize: number;
  weight?: number;
  font?: keyof typeof FONT_STACKS;
  letterSpacing?: number;
  lineHeight?: number;
  left?: number;
  width?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute whitespace-nowrap text-center"
      style={{
        top,
        left,
        right: width === undefined ? 0 : undefined,
        width,
        fontSize,
        fontWeight: weight,
        fontFamily: FONT_STACKS[font],
        letterSpacing,
        lineHeight: lineHeight ?? "normal",
      }}
    >
      {children}
    </div>
  );
}

function CornerMark({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const isTop = corner === "tl" || corner === "tr";
  const isLeft = corner === "tl" || corner === "bl";
  const size = 34.6;
  return (
    <div
      className="absolute"
      style={{
        top: isTop ? 14.9 : undefined,
        bottom: isTop ? undefined : 14.9,
        left: isLeft ? 20.8 : undefined,
        right: isLeft ? undefined : 16,
        width: size,
        height: size,
        borderColor: "#7c93b3",
        borderTopWidth: isTop ? 2 : 0,
        borderBottomWidth: isTop ? 0 : 2,
        borderLeftWidth: isLeft ? 2 : 0,
        borderRightWidth: isLeft ? 0 : 2,
        borderStyle: "solid",
      }}
    />
  );
}

export default CertificateTemplate;
