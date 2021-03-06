import React from "react";
import { Paper, List } from "@material-ui/core";
import { MentionsPlaceHolder } from "../PlaceHolders/PlaceHolders";
import TweetItem from "./TweetItem";

export default function TweetList(props) {
  let { isLoading, tweets, selectedIndex, handleReply, handleSelected } = props;
  return (
    <div style={{ height: "100%", overflow: "scroll", boxShadow: "0px" }}>
      <List
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          padding: 0,
          height: "80vh",
        }}
      >
        {isLoading ? (
          Array(10)
            .fill(0, 0)
            .map((e, i) => <MentionsPlaceHolder key={i.toString()} />)
        ) : tweets.length > 0 ? (
          tweets.map((o, i) => (
            <TweetItem
              key={i.toString()}
              tweet={o}
              selectedIndex={selectedIndex}
              handleReply={(s) => handleReply(s)}
              handleSelected={(id_str, o) => handleSelected(id_str, o)}
            ></TweetItem>
          ))
        ) : (
          <span>No mentioned tweets found</span>
        )}
      </List>
    </div>
  );
}
