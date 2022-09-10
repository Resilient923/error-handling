import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getApi1, getApi2, getApi3, getApi4, getApi5 } from "./api";

function App() {
  // const clickHandler = async (f) => {
  //   const data = await f();
  // }
  const onclick1 = async () => {
    const data = await getApi1();
    alert(`${data}`);
    alert("Hello world!");
  };
  const onclick2 = async () => {
    const data = await getApi2();
    alert(`${data}`);
    alert("Hello world!");
  };
  const onclick3 = async () => {
    const data = await getApi3();
    alert(`${data}`);
    alert("Hello world!");
  };
  const onclick4 = async () => {
    const data = await getApi4();
    alert(`${JSON.stringify(data)}`);
    alert("Hello world!");
  };
  const onclick5 = async () => {
    const result = await getApi5();
    alert(`${JSON.stringify(result)}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={onclick1}>button1</button>
        <button onClick={onclick2}>button2</button>
        <button onClick={onclick3}>button3</button>
        <button onClick={onclick4}>button4</button>
        <button onClick={onclick5}>button5</button>
      </header>
    </div>
  );
}

export default App;
