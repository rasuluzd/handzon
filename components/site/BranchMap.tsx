import { locations } from "@/lib/mock-data";

/**
 * Forenklet «kart» (FR-1.2): avdelingene plottes som punkter i et stilisert
 * koordinatsystem fra reelle lat/lng. Rene SVG-er fra prototypens buildMap().
 * I produksjon byttes dette mot Google Maps. Markerte avdelinger vises større
 * og med navn.
 */
export function BranchMap({ highlighted }: { highlighted?: Set<string> }) {
  const lats = locations.map((location) => location.geo.lat);
  const lngs = locations.map((location) => location.geo.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return (
    <svg
      viewBox="0 0 100 130"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Kart over Handz On-avdelinger i Norge"
      className="h-full w-full"
    >
      <rect width="100" height="130" rx="8" fill="var(--color-map-bg)" />
      {locations.map((location) => {
        const x = 12 + ((location.geo.lng - minLng) / (maxLng - minLng)) * 76;
        const y = 118 - ((location.geo.lat - minLat) / (maxLat - minLat)) * 106;
        const active = highlighted?.has(location.id) ?? false;
        return (
          <g key={location.id}>
            <circle
              cx={x}
              cy={y}
              r={active ? 3 : 1.9}
              fill={active ? "#1e3a70" : "rgba(30,58,112,0.32)"}
            />
            {active && (
              <text
                x={x}
                y={y - 4.5}
                textAnchor="middle"
                fontSize={4}
                fontWeight={700}
                fill="#16223a"
              >
                {location.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
