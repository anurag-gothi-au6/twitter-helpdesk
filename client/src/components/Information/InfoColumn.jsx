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
  const [expanded, setExpanded] = React.useState("panel1");

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
        border:'1px solid #B0B0B0',

      }}
    >
      {selectedTweet && (
        <div style={{ width: "100%" }}>
          <InfoCard selectedTweet={selectedTweet} />

          <ExpansionPanel
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>Description</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <span
                style={{
                  color: "#747880",
                  lineHeight: "1.5em",
                  fontSize: "1.1em"
                }}
              >
                {selectedTweet.user.description}
              </span>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )}
    </Paper>
  );
}
