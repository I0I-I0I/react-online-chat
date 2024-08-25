import EmojiPicker from "emoji-picker-react";
import {
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { Avatar } from "../UI/avatar/Avatar";
import { ButtonIcon } from "../UI/buttonIcon/ButtonIcon";
import { Input } from "../UI/input/Input";
import cl from "./Chat.module.css";
import upload from "../../lib/upload";

const Chat = () => {
	const [chat, setChat] = useState();
	const [text, setText] = useState("");
	const [emojiButtonAcitve, setEmojiButtonAcitve] = useState(false);
	const [img, setImg] = useState({
		file: null,
		url: "",
	});

	const endRef = useRef(null);

	const { currentUser } = useUserStore();
	const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
		useChatStore();

	const currentUserId = currentUser.id;

	const isOwn = (userId) => {
		return userId === currentUserId ? true : false;
	};

	const handleImage = (element) => {
		if (element.target.files[0]) {
			setImg({
				file: element.target.files[0],
				url: URL.createObjectURL(element.target.files[0]),
			});
		}
	};

	useEffect(() => {
		endRef?.current.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}, [chat]);

	useEffect(() => {
		const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
			setChat(res.data());
		});

		return () => {
			unSub();
		};
	}, [chatId]);

	const handleSend = async () => {
		if (text === "") return;

		let imgUrl = null;

		try {
			if (img.file) {
				imgUrl = await upload(img.file);
			}

			await updateDoc(doc(db, "chats", chatId), {
				messages: arrayUnion({
					createdAt: new Date(),
					senderId: currentUser.id,
					text,
					...(imgUrl && { img: imgUrl }),
				}),
			});

			const userIDs = [currentUser.id, user.id];

			userIDs.forEach(async (id) => {
				const userChatsRef = doc(db, "userchats", id);
				const userChatsSnapshot = await getDoc(userChatsRef);

				if (userChatsSnapshot.exists()) {
					const userChatsData = userChatsSnapshot.data();

					const chatIndex = userChatsData.chats.findIndex(
						(c) => c.chatId === chatId,
					);

					userChatsData.chats[chatIndex].lastMessage = text;
					userChatsData.chats[chatIndex].isSeen =
						id === currentUser.id ? true : false;
					userChatsData.chats[chatIndex].updatedAt = Date.now();

					await updateDoc(userChatsRef, {
						chats: userChatsData.chats,
					});
				}
			});
		} catch (error) {
			console.log(error);
		} finally {
			setImg({
				file: null,
				url: "",
			});

			setText("");
		}
	};

	const onClickEmojiButton = () => {
		setEmojiButtonAcitve((prev) => !prev);
	};

	const handleEmoji = (element) => {
		setText((prev) => prev + element.emoji);
		setEmojiButtonAcitve(false);
	};

	return (
		<div className={`${cl.chat}`}>
			<div className={`${cl.top}`}>
				<div className={`${cl.user}`}>
					<Avatar
						src={user?.avatar || "./avatar.png"}
						className={`${cl.avatar}`}
					/>
					<div className={`${cl.texts}`}>
						<span>{user.username}</span>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
					</div>
				</div>
				<div className={`${cl.icons}`}>
					<ButtonIcon src="./phone.png" />
					<ButtonIcon src="./video.png" />
					<ButtonIcon src="./info.png" />
				</div>
			</div>
			<div className={`${cl.center}`}>
				{chat?.messages?.map((message) => (
					<div
						key={message?.createdAt}
						className={`${cl.message} ${isOwn(message.senderId) ? cl.own : ""}`}
					>
						<div className={`${cl.messageInner}`}>
							<Avatar src="/avatar.png" />
							<div className={`${cl.texts}`}>
								{message.img && <img src={message.img} alt="" />}
								<p>{message.text}</p>
								{/* <span>{message}</span> */}
							</div>
						</div>
					</div>
				))}
				{img.url && (
					<div className={`${cl.message}`}>
						<div className={`${cl.texts}`}>
							<img src={img.url} alt="" />
						</div>
					</div>
				)}
				<div ref={endRef}></div>
			</div>
			<div className={`${cl.bottom}`}>
				<div className={`${cl.icons}`}>
					<label htmlFor="file" style={{ cursor: "pointer" }}>
						<input
							type="file"
							id="file"
							style={{ display: "none" }}
							onChange={handleImage}
						/>
						<ButtonIcon src="./img.png" className="button-disable" />
					</label>
					<ButtonIcon src="./camera.png" />
					<ButtonIcon src="./mic.png" />
				</div>
				<Input
					type="text"
					placeholder={
						isCurrentUserBlocked || isReceiverBlocked
							? "You cannot send a message"
							: "Type a message..."
					}
					value={text}
					onChange={(e) => setText(e.target.value)}
					disabled={isCurrentUserBlocked || isReceiverBlocked}
				/>
				<div className={`${cl.emoji}`}>
					<ButtonIcon onClick={onClickEmojiButton} src="./emoji.png" />
					<div className={`${cl.picker}`}>
						<EmojiPicker open={emojiButtonAcitve} onEmojiClick={handleEmoji} />
					</div>
				</div>
				<button
					className={`${cl.sendButton}`}
					onClick={handleSend}
					disabled={isCurrentUserBlocked || isReceiverBlocked}
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default Chat;
