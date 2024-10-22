import { useEffect, useState } from "react";
import TopicChatRoom from "./TopicChatRoom";

const API_URL = import.meta.env.VITE_API_URL;
interface topic {
    topicId: string;
    topicName: string;
    createdByUser: string;
}

const TopicPage = () => {
    const [topicName, setTopicName] = useState<string>("");
    const [topics, setTopics] = useState<topic[]>([]);
    const [hasJoinedTopic, setHasJoinedTopic] = useState<boolean>(false);
    const [joinedTopicName, setJoinedTopicName] = useState<string>("");
    const [topicId, setTopicId] = useState<string>("");
    
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const createTopic = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            alert("You need to be logged in to create a topic");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/topic/createTopic`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({topicName: topicName,
                    createdByUser: userId
                 }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(errorText);
                return;
            }
            alert("Topic created");
            setTopicName("");
            fetchTopics();
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    }

    const fetchTopics = async () => {
        try {
            const response = await fetch(`${API_URL}/topic/getTopics`)
                if (!response.ok) {
                    const errorText = await response.text();
                    alert(errorText);
                    return;
                }
                const data = await response.json();
                setTopics(data);
                console.log(data);
            }  catch (error) {
                    console.error(error);
                    alert("An error occurred");
                }

        }
        useEffect(() => {
            fetchTopics();
    }, []);

    const deleteTopic = async (topicId: string) => {
        if (!token) {
            alert("You need to be logged in to delete a topic");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/topic/deleteTopic?topicId=${topicId}&userId2=${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(errorText);
                return;
            }
            alert("Topic deleted");
            fetchTopics();
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    }

    const joinTopicChatRoom = async (topicId: string, topicName: string ) => {
        console.log("Topic joined");
        console.log(topicId);
        setHasJoinedTopic(true);
        setJoinedTopicName(topicName);
        setTopicId(topicId);
    }



    return (
        <>
            {!hasJoinedTopic ? (
                <>
                    <div>
                        <h1>Topic Page</h1>
                        <p>Here you can create a topic, the bot will adjust to the topic and hopefully answer truly!</p>
                        <form onSubmit={createTopic}>
                            <input
                                className="topicInputField"
                                type="text"
                                placeholder="Topic you want to create"
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                            />
                            <button type="submit">Create topic</button>
                        </form>
                    </div>
                    <div>
                        <h3>Created topics:</h3>
                        {topics.map((topic) => (
                            <div key={topic.topicId}>
                                <button onClick={() => joinTopicChatRoom(topic.topicId, topic.topicName)}>{topic.topicName}</button>
                                {topic.createdByUser === userId && (
                                    <button className="removeTopicBtn" onClick={() => deleteTopic(topic.topicId)}>X</button>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>
                    <h1>Topic: {joinedTopicName}</h1>
                    <TopicChatRoom topicId={topicId}/>
                </div>
            )}
        </>
    );
};

export default TopicPage;
