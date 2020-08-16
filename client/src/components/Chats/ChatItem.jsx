import React from "react";
import { connect } from "react-redux";
import { ListItem, Avatar } from "@material-ui/core";
import moment from "moment";

function ChatItem(props) {
  let { item } = props;
  const isUser = props.user.screen_name === item.user.screen_name;
  const textArr = item.text.split(' ')
  return (
    <div
      style={{
        marginLeft: isUser ? "35%" : "1%",
        display: "flex",
        flexDirection: "row"
      }}
    >
      <Avatar alt={item.user.name} src={item.user.profile_image_url} />
      <ListItem
        style={{
          marginLeft: "1%",
          marginBottom: "2%",
          width: "75%",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#d3d3d3",
          borderRadius: "20px",
          borderTopLeftRadius: 0,
          backgroundColor: isUser ? "#d8edb8" : "#FBFBFB"
        }}
      >
        <span>
          <b className="user-name" style={{fontWeight:'bolder'}}>{item.user.name}</b>
          <b className="created-at" style={{ fontSize: "0.8em",marginLeft:'10px' }}>
          <span role="img" aria-label="">🕑 </span>{moment(item.created_at).fromNow()}
          </b> 
          {item.replier?<p>(Agent:{item.replier.name})</p>:''}
          <p
            style={{
              fontSize: "1em",
              marginRight: "5px",
              marginTop:'10px'

            }}
            className="user-tweet"
          >
            {textArr.map((e,i)=>{
              if(e.includes('@') && e.length>1){
                return <span key={i} style={{color:'blue'}}>{e} </span>
              }
              else{
                return <span key={i}>{e} </span>
              }
            })}
          </p>
          
        </span>
      </ListItem>
    </div>
  );
}

const mapStateToProps = (storeState)=>{
  console.log(storeState)
  return {
    user:storeState.userState.user
  }
}

export default connect(mapStateToProps)(ChatItem);
