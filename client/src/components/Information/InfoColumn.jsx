import React from "react";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Paper
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoCard from "./InfoCard";

export default function InfoColumn(props) {
  const { selectedTweet } = props;
  const [expanded, setExpanded] = React.useState("");

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Paper
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
      }}
      elevation='0'
    >
      {selectedTweet && (
        <div style={{ width: "100%" }}>
          <InfoCard selectedTweet={selectedTweet} />
        <div style={{marginTop:expanded === "panel1"?'30%':'70%'}}>
          <ExpansionPanel
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            elevation='0'
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>Tasks</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div className="details">
            <div className="row"  >
        <input type='checkbox' value='' style={{marginRight:'10px'}}></input>
          <b className="black" style={{color:'black',fontWeight:'bold'}}>Solved Query</b>
        </div>
        <div className="row"  style={{marginTop:'20px'}}>
        <input type='checkbox' value='' style={{marginRight:'10px'}}></input>
        <b className="black" style={{color:'black',fontWeight:'bold'}}>Feedback received</b>
        </div>
        <div className="row"  style={{marginTop:'20px'}}>
        <input type='checkbox' value='' style={{marginRight:'10px'}}></input>
        <b className="black" style={{color:'black',fontWeight:'bold'}}>More support required</b>
        </div>
        <div className="row"  style={{marginTop:'20px'}}>
          <b className="grey" style={{color:'grey',fontWeight:'bolder',textDecoration:'underline'}}> All tasks</b>
        </div>
      </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          </div>
        </div>
      )}
    </Paper>
  );
}
