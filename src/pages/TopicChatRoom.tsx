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

  useSubscription(`/topic/welcome/${topicId}`, (message) => {
    const parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages) => [...prevMessages, parsed]);
  });

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
    }
  };

  const loadMessages = (topicId: string) => {
    fetch(`${API_URL}/api/Topic/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((message: Message) => {
          setListOfMessages((prevMessages) => [...prevMessages, message]);
        });
      });
  };

  useEffect(() => {
    sendWelcome();
    loadMessages(topicId);
  }, [topicId]);

  return (
    <>
      <p>Chatfönster</p>
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