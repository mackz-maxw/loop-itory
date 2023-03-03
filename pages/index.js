import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  //下面这行不能用useState("")，会报错
  const [chatResult, setChatResult] = useState();
  //var chatResult;

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatToMZ: chatInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const replyUser = data.result || '';
      //下面这行不能传入需要运行的参数，比如data.result,会报错
      setChatResult(replyUser);
      console.log(chatResult);
      console.log("--result is");
      setChatInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>数字生命交互</title>
        <link rel="icon" href="/MZ.png" />
      </Head>

      <main className={styles.main}>
        <img src="/MZ.png" className={styles.icon} />
        <h3>数字生命交互</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="输入信息"
            value={chatInput}
            //onChange={(e) => setChatInput(e.target.value)}
            onChange={function(e){
              setChatInput(e.target.value);
            }}
          />
          <input type="submit" value="请求回复" />
        </form>
        <div className={styles.result}>{chatResult}</div>
      </main>
    </div>
  );
}
