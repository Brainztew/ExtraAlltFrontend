import { useEffect, useState } from "react";
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

  useSubscription(`/topic/${topicId}`, (message) => {
    const parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages) => [...prevMessages, parsed]);
  });

  const sendWebsocketMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = localStorage.getItem("userEmail")!;
    if (stompClient) {
      stompClient.publish({
        destination: `/app/${topicId}`,
        body: JSON.stringify({
          sender: email,
          content: messageFromUser,
          topicId: topicId,
        }),
      });
      setMessageFromUser("");
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

  useEffect(() => {
    const initializeChat = async () => {
      await loadMessages(topicId);
      sendWelcome();
    };

    initializeChat();
  }, [topicId]);

  if (!messagesLoaded) {
    return <div>Loading messages...</div>; 
  }


  return (
    <>
      <p>Chatwindow</p>
      <button onClick={leaveTopic}>Leave Topic</button>
      <form onSubmit={sendWebsocketMessage}>
        <input
          type="text"
          name="messageFromUser"
          value={messageFromUser}
          onChange={(e) => setMessageFromUser(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {listOfMessages.map((message, index) => (
          <li key={index}>
            {message.sender}: {message.content}
          </li>
        ))}
      </ul>
    </>
  );
};

export default TopicChatRoom;