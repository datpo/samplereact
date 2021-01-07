import { renderToString } from "react-dom/server";
import React from "react";

export const loading = {
  runLoadingBlockUI,
  stopRunLoading
};


function runLoadingBlockUI() {
  ($ as any).blockUI({
    css: {
      border: "none",
      padding: "15px",
      backgroundColor: 0,
      "-webkit-border-radius": "10px",
      "-moz-border-radius": "10px",
      opacity: 0.8,
      color: "#fff"
    },
    message: renderToHtmlCode()
  });
}

function stopRunLoading() {
  ($ as any).unblockUI();
}

const renderToHtmlCode = () => {
  return renderToString(
    <div
      style={{
        color: "#fffff",
        borderColor: "#fffff",
        margin: "0 auto",
        display: "block"
      }}
      className="cssload-thecube"
    >
      <div className="cssload-cube cssload-c1"></div>
      <div className="cssload-cube cssload-c2"></div>
      <div className="cssload-cube cssload-c4"></div>
      <div className="cssload-cube cssload-c3"></div>
    </div>
  );
};
