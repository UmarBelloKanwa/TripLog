import { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import useIsMobile from "../hooks/useIsMobile";
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

export default function LogDayCanvas({ log }) {
  const canvasRef = useRef(null);
  const theme = useTheme();
  const isMobile = useIsMobile();

  const getCanvasSize = (canvas) => {
    const container = canvas.parentElement;
    const baseWidth = isMobile ? 1000 : container.offsetWidth || 1000;
    const baseHeight = isMobile ? 200 : 170;
    return { baseWidth, baseHeight };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { baseWidth, baseHeight } = getCanvasSize(canvas);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = baseWidth * dpr;
    canvas.height = baseHeight * dpr;
    canvas.style.width = `${baseWidth}px`;
    canvas.style.height = `${baseHeight}px`;

    // Scale context for high DPI
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, baseWidth, baseHeight, log.totals);
    drawStatusLines(ctx, baseWidth, baseHeight, log.entries);
  }, [log, isMobile, theme]);

  const drawGrid = (ctx, width, height, totals) => {
    const hourWidth = (width - 100) / 24;
    const rowHeight = (height - 30) / 4;
    const quarterHourWidth = hourWidth / 4;

    ctx.fillStyle = "hsla(241, 44.50%, 53.30%, 0.06)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(83, 91, 242, 0.65)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(50, 30 + i * rowHeight);
      ctx.lineTo(width - 50, 30 + i * rowHeight);
      ctx.stroke();
    }

    for (let i = 0; i <= 24; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + i * hourWidth, 30);
      ctx.lineTo(50 + i * hourWidth, height);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    for (let i = 0; i < 24; i++) {
      for (let row = 0; row < 4; row++) {
        for (let q = 1; q <= 3; q++) {
          const x = 50 + i * hourWidth + q * quarterHourWidth;
          const lineHeight = rowHeight / 4.3;
          const thisLineHeight = q === 2 ? lineHeight * 2 : lineHeight;

          ctx.beginPath();
          ctx.moveTo(x, 30 + row * rowHeight);
          ctx.lineTo(x, 30 + row * rowHeight + thisLineHeight);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";

    for (let i = 0; i < 24; i++) {
      let label = "";
      if (i === 0) continue;
      if (i === 1) label = "Midnight";
      else if (i === 12) label = "Noon";
      else label = i.toString();

      ctx.fillText(label, 50 + i * hourWidth, 20);
    }

    ctx.textAlign = "right";
    ctx.fillText("OFF", 45, 30 + rowHeight / 2 + 5);
    ctx.fillText("SB ", 45, 30 + rowHeight * 1.5 + 5);
    ctx.fillText(" D ", 45, 30 + rowHeight * 2.5 + 5);
    ctx.fillText("ON ", 45, 30 + rowHeight * 3.5 + 5);

    ctx.textAlign = "left";
    ctx.fillText(totals.OFF, width - 45, 30 + rowHeight / 2 + 5);
    ctx.fillText(totals.SB, width - 45, 30 + rowHeight * 1.5 + 5);
    ctx.fillText(totals.D, width - 45, 30 + rowHeight * 2.5 + 5);
    ctx.fillText(totals.ON, width - 45, 30 + rowHeight * 3.5 + 5);
  };

  const drawStatusLines = (ctx, width, height, entries) => {
    const hourWidth = (width - 100) / 24;
    const rowHeight = (height - 30) / 4;
    const statusMap = { OFF: 0, SB: 1, D: 2, ON: 3 };

    ctx.strokeStyle = theme.palette.text.secondary;
    ctx.lineWidth = 3;

    for (let i = 0; i < entries.length; i++) {
      const current = entries[i];
      const next = entries[i + 1];

      const startX = 50 + current.startHour * hourWidth;
      const endX = 50 + current.endHour * hourWidth;
      const startY = 30 + (statusMap[current.status] + 0.5) * rowHeight;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, startY);
      ctx.stroke();

      if (next) {
        const nextY = 30 + (statusMap[next.status] + 0.5) * rowHeight;
        ctx.beginPath();
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX, nextY);
        ctx.stroke();
      }
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `eld-log-of-day${log?.log_day}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        overflow: "hidden",
        padding: "0",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: isMobile ? "auto" : "5/1", // allow natural height on mobile
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          overflowX: isMobile ? "auto" : "hidden",
          padding: "0",
          margin: "0",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            padding: "0",
            overflow: "hidden",
            margin: "0",
          }}
        />
      </div>
      <IconButton aria-label="download" onClick={downloadCanvas}>
        <SaveAltIcon />
      </IconButton>
    </div>
  );
}
