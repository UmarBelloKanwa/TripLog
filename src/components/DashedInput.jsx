import React, { useRef, useEffect, useState } from "react";

const DashedEditable = ({
  name,
  value,
  onChange,
  maxLength = 20,
  placeholder = "Type here...",
}) => {
  const textareaRef = useRef(null);
  const [text, setText] = useState(value || "");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      adjustSize();
    }
  }, [text]);

  const adjustSize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.width = "auto"; // Reset width to recalculate
    textarea.style.width = `${textarea.scrollWidth}px`; // Set new width
  };

  const handleChange = (e) => {
    let newText = e.target.value;

    if (newText.length > maxLength) {
      newText = newText.substring(0, maxLength);
    }

    setText(newText);
    onChange({ target: { name, value: newText } });
  };

  return (
    <textarea
      ref={textareaRef}
      name={name}
      value={text}
      onChange={handleChange}
      placeholder={placeholder}
      style={{
        border: "none",
        borderBottom: "1px dashed rgba(0, 0, 0, .7)",
        resize: "none",
        overflow: "hidden",
        outline: "none",
        textAlign: "justify",
        color: "inherit",
        spellCheck: "false",
        direction: "ltr",
        width: "auto",
        height: "1.5em",
        lineHeight: "1.5em",
        display: "inline-block",
        verticalAlign: "baseline",
        padding: "0 5px",
        font: "100%",
        backgroundColor: "transparent",
        marginBottom: "-5px",
      }}
    />
  );
};

export default DashedEditable;
