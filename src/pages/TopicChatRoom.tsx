import { useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";

const API_URL = import.meta.env.VITE_API_URL;

interface TopicChatRoomProps {
  topicId: string;
}

interface Message {
  content: string;
  sender: string;
  topicId: string;
}

const TopicChatRoom: React.FC<TopicChatRoomProps> = ({ topicId }) => {
  const stompClient = useStompClient();
  const [listOfMessages, setListOfMessages] = useState<Message[]>([]);
  const [messageFromUser, setMessageFromUser] = useState<string>("");
  const [welcomeSent, setWelcomeSent] = useState<boolean>(false);
  const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false);
  const [usersInTopic, setUsersInTopic] = useState<string[]>([]);
  const chatboxRef = useRef<HTMLUListElement>(null);

  useSubscription(`/topic/${topicId}`, (message) => {
    const parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages) => [...prevMessages, parsed]);
  });

  useSubscription(`/topic/update/${topicId}`, () => {
    getUsersInTopic();

  });

  useSubscription(`/topic/aianswer/${topicId}`, (message) => {
    const parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages) => [...prevMessages, parsed]);
    loadMessages(topicId);
  });

  useSubscription(`/topic/welcome/${topicId}`, (message) => {
    const parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages) => [...prevMessages, parsed]);
  });

  const sendWebsocketMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = localStorage.getItem("userEmail")!;
    let content = messageFromUser;

    if (stompClient) {
      stompClient.publish({
        destination: `/app/${topicId}`,
        body: JSON.stringify({
          sender: email,
          content: content,
          topicId: topicId,
        }),
      });
      setMessageFromUser("");
    }
    if (content.includes("Hey bot")) {
      content = content.replace("Hey bot", "").trim();
      try {
        const response = await fetch(`${API_URL}/topic/addAiMessageToTopic?topicId=${topicId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        });
        if (!response.ok) {
          const errorText = await response.text();
          alert(errorText);
          return;
        }
      } catch (error) {
        console.error("Error sending AI message:", error);
        alert("An error occurred while sending AI message");
        return;
      }
      loadMessages(topicId);
    }
  };

  const sendWelcome = () => {
    const email = localStorage.getItem("userEmail")!;
    if (stompClient && !welcomeSent) {
      stompClient.publish({
        destination: `/app/welcome/${topicId}`,
        body: JSON.stringify({
          sender: "System",
          content: "Welcome to the chat! " + email,
          topicId: topicId,
        }),
      });
      setWelcomeSent(true);
      joinTopic();
    }
  };

  const joinTopic = async () => {
    const userId = localStorage.getItem("userId");
    
    try {
      const response = await fetch(`${API_URL}/topic/joinTopic?userId=${userId}&topicId=${topicId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId: topicId, userId: userId }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  }

  const loadMessages = async (topicId: string) => {
    try {
      const response = await fetch(`${API_URL}/topic/getMessagesInTopic?topicId=${topicId}`);
      if (!response.ok) {
        throw new Error("Failed to load messages");
      }
      const data = await response.json();
      const messages = data.map((msg: string) => {
        const [sender, content] = msg.split(": ");
        return { sender, content, topicId };
      });
      setListOfMessages(messages);
      setMessagesLoaded(true); 
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const leaveTopic = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`${API_URL}/topic/leaveTopic?userId=${userId}&topicId=${topicId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId: topicId, userId: userId }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  }

  const getUsersInTopic = async () => {
    try {
      const response = await fetch(`${API_URL}/topic/getUsersInTopic?topicId=${topicId}`);
      if (!response.ok) {
        throw new Error("Failed to load users");
      }
      const data = await response.json();
      setUsersInTopic(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  useEffect(() => {
    if (chatboxRef.current) {
      console.log("Scrolling to bottom");
      
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [listOfMessages]);

 
  
  useEffect(() => {
    const initializeChat = async () => {
      await loadMessages(topicId);
      sendWelcome();
      getUsersInTopic();
    };

    initializeChat();
  }, [topicId]);

 if (!messagesLoaded) {
    return <div>Loading messages...</div>; 
  }

  const userEmail = localStorage.getItem("userEmail")!;

  return (
    <>
      <p>Write "Hey bot" to make the ai answer your call!</p>
      <button onClick={leaveTopic}>Leave Topic</button>
        <div className="chatContainer">
        <ul className="Chatbox" ref={chatboxRef}>
          {listOfMessages.map((message, index) => (
            <li 
            key={index}
            className={
              message.sender === userEmail
              ? "user-msg"
              : message.sender === "System" || message.sender === "AI bot"
              ? "ai-msg"
              : "other-msg"
            }
            >
              {message.sender}: {message.content}
            </li>
          ))}
        </ul>      
        <div>
        <h3>Users in topic:</h3>
        <ul>
          {usersInTopic.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
        </div>
        </div>
        <form className="sendField" onSubmit={sendWebsocketMessage}>
          <textarea
            className="messageInputField"
            name="messageFromUser"
            value={messageFromUser}
            onChange={(e) => setMessageFromUser(e.target.value)}
          />
          <button id="sendChatBtn"type="submit">Send</button>
        </form>
    </>
  );
};

export default TopicChatRoom;