import React from "react";
import { ListItem, Avatar, Divider } from "@material-ui/core";
import moment from "moment";

export default function TweetItem(props) {
  let { tweet, handleReply, handleSelected } = props;
  return (
    <>
    <div style={{ margin:'1rem', marginLeft:0,  backgroundColor:'white',marginTop:0}}>
      <ListItem
        key={tweet.id.toString()}
        selected={props.selectedIndex !== tweet.id_str}
        style={{ backgroundColor:'white',border:'1px gray solid',borderRadius:'3%',height:'100px'}}
        onClick={() => {
          handleReply("@" + tweet.user.screen_name + " ");
          handleSelected(tweet.id_str, tweet);
        }}
      >
        <Avatar
          alt={tweet.user.name}
          src={tweet.user.profile_image_url}
        ></Avatar>
        <div style={{ marginLeft: "10px", maxWidth: "80%" }}>
          <b style={{ fontSize: "1em" }}>
            {tweet.user.name}{" "}
            <span
              style={{
                fontWeight: "normal",
                fontSize: "0.8em"
              }}
            >
              {moment(tweet.created_at).fromNow()}
            </span>
          </b>
          <p>
            <span style={{ fontSize: "0.8em" }}>{tweet.text}</span>
          </p>
        </div>
      </ListItem>
      <Divider />
      </div>
    </>
  );
}
