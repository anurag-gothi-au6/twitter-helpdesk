import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import { Avatar } from "@material-ui/core";
import UseMediaQuery from "../../mediaQuery/useMediaQuery"
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(2)
    }
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15)
  }
}));
export default function InfoCard(props) {
  let { selectedTweet } = props;
  const isRowBased = UseMediaQuery("(min-width: 1000px)");
  const classes = useStyles();

  return (
    <div>
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "10px"
      }}
    >
      <div className={classes.root}>
        <Avatar
          alt={selectedTweet.user.name}
          src={selectedTweet.user.profile_image_url.replace("normal","400x400")}
          className={classes.large}
        ></Avatar>
      </div>

      <div style={styles.screen_name(isRowBased)}>
        <h2 style={{ margin: "3px"}}>{selectedTweet.user.name}</h2>
      </div>
      <span style={{ color: "#50d950",fontSize:'15px' }}>
        online
      </span>
        <div className='contact' style={{margin:'30px'}}>
      <span style={{backgroundColor:'#efefef',padding:'10px',margin:'10px',border:'0',borderRadius:'20px',width:'50px'}}>📞 Call</span>
      <span style={{backgroundColor:'#efefef',padding:'10px',margin:'10px',border:'0',borderRadius:'20px',width:'50px'}}>✉ Email</span>
      </div>
      </div>
      <div className="details" style={{margin:'30px',marginTop:'30px'}}>
        <div className="row"  style={{display:'flex',justifyContent:'space-between'}}>
          <b className="grey" style={{color:'grey',fontWeight:'bolder'}}>Followers</b>
          <b className="black" style={{color:'black',fontWeight:'bolder'}}>{selectedTweet.user.followers_count}</b>
        </div>
        <div className="row"  style={{display:'flex',justifyContent:'space-between',marginTop:'20px'}}>
          <b className="grey" style={{color:'grey',fontWeight:'bolder'}}>Username</b>
          <b className="black" style={{color:'black',fontWeight:'bolder'}}>{selectedTweet.user.screen_name}</b>
        </div>
        <div className="row"  style={{display:'flex',justifyContent:'space-between',marginTop:'20px'}}>
          <b className="grey" style={{color:'grey',fontWeight:'bolder'}}>Location</b>
          <b className="black" style={{color:'black',fontWeight:'bolder'}}><Icon
          path={mdiMapMarker}
          color={"black"}
          size={0.7}
          style={{ marginRight: 10, padding: 0 }}
        /> {selectedTweet.user.location
            ? selectedTweet.user.location
            : "Unknown"}</b>
        </div>
      </div>
    </div>
  );
}

const styles = {
  screen_name: isRowBased => ({
    width: "100%",
    display: "flex",
    flexDirection: isRowBased ? "row" : "column",
    justifyContent: isRowBased ? "center" : "space-around",
    alignItems: "center"
  })
};
