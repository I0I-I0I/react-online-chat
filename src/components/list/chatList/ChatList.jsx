import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useInput from "../../../hooks/useInput";
import { useChatStore } from "../../../lib/chatStore";
import { db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import { Avatar } from "../../UI/avatar/Avatar";
import { Input } from "../../UI/input/Input";
import { AddUser } from "../../addUser/AddUser";
import cl from "./ChatList.module.css";

const ChatList = () => {
	const [addMode, setAddMode] = useState(false);
	const [chats, setChats] = useState([]);

	const [searchInput, setSearchInput] = useInput("");
	const searchInputValue = searchInput.value;

	const { currentUser } = useUserStore();
	const { changeChat } = useChatStore();

	useEffect(() => {
		const unSub = onSnapshot(
			doc(db, "userchats", currentUser.id),
			async (res) => {
				const items = res.data().chats;

				const promises = items.map(async (item) => {
					const userDocRef = doc(db, "users", item.receiverId);
					const userDocSnap = await getDoc(userDocRef);

					const user = userDocSnap.data();

					return { ...item, user };
				});

				const chatData = await Promise.all(promises);

				setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
			},
		);

		return () => {
			unSub();
		};
	}, [currentUser.id]);

	const handleSelect = async (chat) => {
		const userChats = chats.map((item) => {
			const { user, ...rest } = item;
			return rest;
		});

		const chatIndex = userChats.findIndex(
			(item) => item.chatId === chat.chatId,
		);

		userChats[chatIndex].isSeen = true;

		const userChatsRef = doc(db, "userchats", currentUser.id);

		try {
			await updateDoc(userChatsRef, {
				chats: userChats,
			});
		} catch (error) {
			console.log(error);
		}

		changeChat(chat.chatId, chat.user);
	};

	const onClickAddButton = () => {
		setAddMode((prev) => !prev);
	};

	const filtredChats = chats.filter((c) =>
		c.user.username.toLowerCase().includes(searchInputValue.toLowerCase()),
	);

	return (
		<div className={`${cl.chatList}`}>
			<div className={`${cl.search}`}>
				<div className={`${cl.searchBar}`}>
					<Input
						className={`${cl.input}`}
						type="text"
						placeholder="Search"
						{...searchInput}
					/>
				</div>
				<button
					onClick={onClickAddButton}
					className={`${cl.buttonAdd}`}
					style={{
						backgroundImage: `url(${addMode ? "./minus.png" : "./plus.png"})`,
					}}
				></button>
			</div>

			{filtredChats.map((chat) => (
				<div
					className={`${cl.item}`}
					key={chat.chatId}
					onClick={() => handleSelect(chat)}
					style={{
						backgroundColor: chat?.isSeen ? "transparent" : "rgb(var(--blue))",
					}}
				>
					<Avatar
						src={
							chat.user.blocked.includes(currentUser.id)
								? "./avatar.png"
								: chat.user.avatar
						}
						className={`${cl.avatar}`}
					/>
					<div className={`${cl.texts}`}>
						<span>
							{chat.user.blocked.includes(currentUser.id)
								? "User"
								: chat.user.username}
						</span>
						<p>{chat.lastMessage}</p>
					</div>
				</div>
			))}

			{addMode && <AddUser />}
		</div>
	);
};

export default ChatList;
