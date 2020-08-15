import React, { useState, useEffect } from "react";
import {
  makeStyles,
} from "@material-ui/core";
import { apiUrl } from "../../shared/vars";
import axios from "axios";
import "../../styles/dashboard.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  input: {
    color: "black",
    borderRadius: "20px",
    margin: "10px",
    padding: "10px",
    width:'200px'
  },
  button:{
    color: "black",
    borderRadius: "10px",
    margin: "10px",
    padding: "10px",
    width:'200px',
    '&:disabled':{
      backgroundColor:'gray'
    }
  },
  submit: {
    backgroundColor: "#78e08f",
    borderRadius: "10px",
    margin: "10px",
    padding: "10px",
    width:'200px',
    color:'white',
    fontSize: "1rem",
    fontWeight:'bolder',
  },
  toggle:{
    borderRadius:'50%',
    color: "black",
    backgroundColor: "white",
    height:'50px',
    width:'50px'
  }
}));

export default function Header(props) {
  const classes = useStyles();
  const [agentView, setAgentView] = useState(false);
  const [isLoading, setLoading] = useState(true);

  function useInput({ type, placeholder }) {
    const [value, setValue] = useState("");
    const input = (
      <input
        className={classes.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        placeholder={placeholder}
        required
        color="secondary"
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
      />
    );
    return [value, input];
  }

  const [name, nameInput] = useInput({
    type: "text",
    placeholder: "Agent Name",
  });
  const [email, emailInput] = useInput({ type: "email", placeholder: "Email" });

  const addAgent = async (nam, emal, enterpriseId) => {
    setLoading(true);
    const res = await axios.post(
      `${apiUrl}/api/auth/enterprise/${enterpriseId}/addagent`,
      {
        name: nam,
        email: emal,
      }
    );
    if (res.data) {
      setAgentView(false)
      window.alert("Mail Sent To Agent");
    }
    console.log(res);
  };
  useEffect(() => {
    if (name.length > 3 && /.+@.+\.[A-Za-z]+$/.test(email)) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [name, email]);

  return (
    <div style={{ marginLeft: "5rem" }}>
      <div className="inline">
        <h3 className="gray">Twitter help desk</h3>
        <p className="gray right">User: {props.Name}</p>
        <button onClick={props.logout} className={classes.button} style={{width:'100px'}} size={"medium"}>
          Logout
        </button>
      </div>
      <div className="margin-2">
        <h1 className="dark">Converstation</h1>
        {props.Admin ? (
          !agentView ? (
            <button
              style={{ float: "right", width:'100px' }}
              onClick={() => setAgentView(true)}
              className={classes.button}
            >
              Add Agent
            </button>
          ) : (
            <form style={{ marginRight: "2rem", float: "right" }}>
              {nameInput}
              {emailInput}
              <button
                disabled={isLoading}
                className={isLoading ? classes.button : classes.submit}
                onClick={() => addAgent(name, email, props.enterprise)}
              >add agent</button>
              <button className={classes.toggle} onClick={() => setAgentView(false)}>←</button>
            </form>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
