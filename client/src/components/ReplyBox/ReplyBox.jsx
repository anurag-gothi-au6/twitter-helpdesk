import React from "react";
import {TextField } from "@material-ui/core";

export default function ReplyBox(props) {
  let { reply, handleInputChange, postReplies, replyButtonDisabled } = props;
  return (
    <div
      style={{
        flexDirection: "row",
        marginLeft: "20px",
        marginRight: "20px",
        marginBottom:'0px',
        display: "flex"
      }}
    >
              <img src={props.profileImage} className='icon' style={{borderRadius:'50%',marginRight:'20px'}} alt='profile' height='30' width='30'></img>

      <TextField
        id="outlined-full-width"
        name="reply"
        fullWidth
        rows="1"
        value={reply}
        onChange={handleInputChange}
        variant={"outlined"}
        style={{ backgroundColor: "white", marginTop: "10px",borderRadius:'0px 20px 20px',height:'60px' }}
        InputProps={{
          endAdornment: (
            <button
              disabled={replyButtonDisabled}
              className="reply"
              style={{backgroundColor:'white',border:'0' }}
              onClick={postReplies}
            >
              <img src='https://image.flaticon.com/icons/svg/565/565335.svg' alt='reply' height='20px' width='20px'/>
            </button>
          )
        }}
      ></TextField>
    </div>
  );
}
