import React, { useState } from "react";
import "./style.css";

const App = () => {
  const [messages, setMessages] = useState([
    {
      text : "Hello, How Can I Assist You Today",
      role: "bot"
    }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (input.trim()) {
      const newMessages = [...messages, {text : input, role : "user"}]
      setMessages(newMessages)

      try {
        const res = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({message: input})
        })

        const data = await res.json();
        setMessages((prevMessages) => [...prevMessages, {text: data.reply, role:"bot"}])
      } catch (error) {
        setMessages((prevMessages) => [...prevMessages, { text: "Failed to fetch response", role: "bot" }]);
      }

      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role === "user" ? "right" : "left"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default App;
