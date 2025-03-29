import React, { useRef, useEffect, useState } from "react";

const DashedEditable = ({
  name,
  value,
  onChange,
  maxLength = 20,
  placeholder = "Type here...",
}) => {
  const divRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const div = divRef.current;
  useEffect(() => {
    if (!div) return;

    const adjustSize = () => {
      div.style.width = "auto";
      div.style.width = `${div.scrollWidth}px`;
    };

    adjustSize(); // Initial adjustment
    div.addEventListener("input", adjustSize);

    return () => div.removeEventListener("input", adjustSize);
  }, [div, value]);

  const handleSetIsEditing = () => {
    if (div.innerText.trim() == placeholder) {
      div.innerText = "";
      setIsEditing(true);
    }
    setIsEditing(true);
  };

  const handleInput = (e) => {
    let text = e.target.innerText;

    if (text.length > maxLength) {
      text = text.substring(0, maxLength); 
      e.target.innerText = text; 
    }

    onChange(text);
    handleSetIsEditing(); // Remove placeholder color when typing
  };

  const handleBlur = () => {
    if (!div.innerText.trim()) {
      div.innerText = placeholder;
      div.style.color = "gray";
      divRef.current.style.width = "auto";
      setIsEditing(false);
    }
  };

  return (
    <span
      id={name}
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={handleSetIsEditing}
      onBlur={handleBlur}
      style={{
        borderBottom: "1px dashed rgba(0, 0, 0, .7)",
        display: "inline-block",
        minWidth: "50px",
        whiteSpace: "nowrap",
        outline: "none",
        fontSize: "inherit",
        fontFamily: "inherit",
        color: isEditing || value ? "white" : "gray", 
      }}
    >
      {value || placeholder}
    </span>
  );
};

export default DashedEditable;
