import React from "react";
import { Button, TextField } from "@material-ui/core";

export default function ReplyBox(props) {
  let { reply, handleInputChange, postReplies, replyButtonDisabled } = props;
  return (
    <div
      style={{
        flexDirection: "column",
        marginLeft: "10px",
        marginRight: "10px"
      }}
    >
      <TextField
        id="outlined-full-width"
        name="reply"
        fullWidth
        multiline
        rows="4"
        value={reply}
        onChange={handleInputChange}
        variant={"outlined"}
        style={{ backgroundColor: "white", marginTop: "10px",borderRadius:'0px 20px 20px' }}
        InputProps={{
          endAdornment: (
            <Button
              disabled={replyButtonDisabled}
              className="reply"
              color="primary"
              variant="contained"
              style={{ borderRadius: "10%" }}
              onClick={postReplies}
            >
              Reply
            </Button>
          )
        }}
      ></TextField>
    </div>
  );
}
