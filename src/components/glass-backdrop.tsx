// Soft, slowly shifting grey background used behind the calendar. Large
// blurred grey blobs drift around, with a few thin white circuit traces
// scattered over them; the calendar's frosted `glass-light` panel sits on
// top, so it all shows through like light behind glass. Render it as the
// first child of a `relative overflow-hidden` section; the section's
// content needs `relative z-10` to sit above it.

// A few short traces (with a pad at the end), scattered — mostly toward the
// edges so they peek out around the calendar panel.
const TRACES: { d: string; pad: [number, number] }[] = [
  { d: 'M0 140 H120 L160 180 H260', pad: [260, 180] },
  { d: 'M1440 110 H1330 L1290 150 H1210', pad: [1210, 150] },
  { d: 'M60 900 V780 L100 740 H190', pad: [190, 740] },
  { d: 'M1440 640 H1360 L1320 680 V760', pad: [1320, 760] },
  { d: 'M0 470 H70 L110 430 H150', pad: [150, 430] },
  { d: 'M1250 900 V830 L1210 790 H1130', pad: [1130, 790] },
  { d: 'M620 0 V50 L660 90 H760', pad: [760, 90] },
];

export function GlassBackdrop() {
  return (
    <div data-backdrop aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="glass-blob glass-blob-1" />
      <div className="glass-blob glass-blob-2" />
      <div className="glass-blob glass-blob-3" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
          {TRACES.map((t, i) => <path key={i} d={t.d} />)}
          {TRACES.map((t, i) => <circle key={`p${i}`} cx={t.pad[0]} cy={t.pad[1]} r="4" />)}
        </g>
      </svg>
    </div>
  );
}
