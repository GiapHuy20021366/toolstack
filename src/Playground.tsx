import { useState } from "react";
import { Rnd } from "react-rnd";

export default function Playground() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const nodes = [
    { id: 1, x: 40, y: 40 },
    { id: 2, x: 200, y: 120 },
  ];

  return (
    <div
      style={{
        width: 700,
        height: 400,
        border: "3px dashed #4da3ff",
        position: "relative",
        background: "#f7fbff",
        overflow: "hidden",
      }}
    >
      {nodes.map((n) => (
        <Rnd
          key={n.id}
          bounds="parent"
          default={{
            x: n.x,
            y: n.y,
            width: 120,
            height: 80,
          }}
          onDragStart={() => setActiveId(n.id)}
          onDragStop={() => setActiveId(null)}
          onResizeStart={() => setActiveId(n.id)}
          onResizeStop={() => setActiveId(null)}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: activeId === n.id ? "#4da3ff55" : "#4da3ff22",
              border: "2px solid #4da3ff",
              borderRadius: 6,
              transition: "all 0.15s ease",
            }}
          />
        </Rnd>
      ))}
    </div>
  );
}
