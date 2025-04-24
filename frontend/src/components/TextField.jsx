import * as React from "react";
import { default as MuiTextField } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
      ...theme.applyStyles("dark", {
        boxShadow:
          "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
      }),
      borderRadius: "0.7em",
      border: "1px solid rgba(0, 0, 0, 0.2)",
    },
  },
}));

const TextField = ({ needToClear = true, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <StyledTextField
      {...props}
      autoFocus={true}
      required={true}
      fullWidth={true}
      variant="outlined"
      spellCheck={false}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setTimeout(() => setIsFocused(false), 300)}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props?.slotProps?.input,
          ...(needToClear &&
            isFocused &&
            props?.value?.length && {
              endAdornment: (
                <InputAdornment position="end">
                  <ClearSharpIcon
                    onClick={() => {
                      props.onChange({
                        target: { name: props.name, value: "" },
                      });
                    }}
                  />
                </InputAdornment>
              ),
            }),
        },
      }}
    />
  );
};

export default TextField;
