import { Rnd } from "react-rnd";

export default function NestedCanvas() {
  return (
    <div
      style={{
        width: "1000px",
        height: "100vh",
        position: "relative",

        border: "2px solid #4da3ff",
        backgroundImage: `
      radial-gradient(circle, #cbd5e1 1px, transparent 1px)
    `,
        backgroundSize: "8px 8px",
        backgroundPosition: "2px 2px",
      }}
    >
      {/* ===== ROOT CANVAS ===== */}
      <Rnd
        bounds="parent"
        cancel=".inner-node"
        default={{ x: 40, y: 40, width: 700, height: 420 }}
        dragGrid={[8, 8]}
        resizeGrid={[8, 8]}
      >
        <Rnd bounds="parent" default={{ x: 0, y: 0, width: 120, height: 120 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              //   borderRadius: "50%",
              background: "#4da3ff",
            }}
          />
        </Rnd>

        <Rnd
          bounds="parent"
          default={{ x: 80, y: 200, width: 140, height: 140 }}
        >
          <svg width="100%" height="100%">
            <polygon points="70,0 140,140 0,140" fill="#1976d2" />
          </svg>
        </Rnd>

        <Rnd
          bounds="parent"
          default={{ x: 180, y: 20, width: 120, height: 120 }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "60px solid transparent",
              borderRight: "60px solid transparent",
              borderBottom: "120px solid #ff8c00",
            }}
          />
        </Rnd>
        <div
          style={{
            display: "none",
            width: "100%",
            height: "100%",
            border: "3px dashed #4da3ff",
            // background: "#f7fbff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* ===== INNER CONTAINER ===== */}
          <Rnd
            bounds="parent"
            cancel=".child-node"
            default={{ x: 80, y: 60, width: 300, height: 200 }}
            onDragStart={(e) => e.stopPropagation()}
            onResizeStart={(e) => e.stopPropagation()}
            dragGrid={[8, 8]}
            resizeGrid={[8, 8]}
          >
            <div
              className="inner-node"
              style={{
                width: "100%",
                height: "100%",
                border: "2px solid #ff8c00",
                // background: "#fff3e0",
                position: "relative",
              }}
            >
              {/* ===== CHILD NODE ===== */}
              <Rnd
                bounds="parent"
                default={{ x: 40, y: 40, width: 120, height: 80 }}
                onDragStart={(e) => e.stopPropagation()}
                onResizeStart={(e) => e.stopPropagation()}
                dragGrid={[8, 8]}
                resizeGrid={[8, 8]}
                // dragHandleClassName="drag-handle"
              >
                {/* <div
                  className="drag-handle"
                  style={{
                    height: 30,
                    background: "#1976d2",
                    color: "white",
                    cursor: "move",
                  }}
                >
                  Drag here
                </div> */}
                <div
                  className="child-node"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "2px solid #1976d2",
                    background: "#4da3ff33",
                  }}
                />
              </Rnd>
            </div>
          </Rnd>
        </div>
      </Rnd>
    </div>
  );
}
