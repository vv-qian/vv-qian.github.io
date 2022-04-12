import React from "react";

function Row({ left, right, subtitle, id, children }) {
  return (
    <div className={`row ${subtitle ? "project" : ""}`} id={id}>
      <div className={`left-align ${subtitle ? "subtitle" : ""}`}>{left}</div>
      <div className="right-align">{right || children}</div>
    </div>
  );
}

export default Row;
