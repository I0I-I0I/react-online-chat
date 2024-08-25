import {
	arrayUnion,
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { Avatar } from "../UI/avatar/Avatar";
import cl from "./AddUser.module.css";

export const AddUser = () => {
	const [user, setUser] = useState(null);
	const { currentUser } = useUserStore();

	const handlerSearch = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const username = formData.get("username");

		try {
			const userRef = collection(db, "users");
			const q = query(userRef, where("username", "==", username));

			const querySnapShot = await getDocs(q);

			if (!querySnapShot.empty) {
				setUser(querySnapShot.docs[0].data());
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleAdd = async () => {
		const chatRef = collection(db, "chats");
		const userChatsRef = collection(db, "userchats");

		try {
			const newChatRef = doc(chatRef);

			await setDoc(newChatRef, {
				createdAt: serverTimestamp(),
				messages: [],
			});

			await updateDoc(doc(userChatsRef, user.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: currentUser.id,
					updatedAt: Date.now(),
				}),
			});

			await updateDoc(doc(userChatsRef, currentUser.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: user.id,
					updatedAt: Date.now(),
				}),
			});

			console.log(newChatRef.id);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={`${cl.addUser}`}>
			<form onSubmit={handlerSearch} className={`${cl.form}`}>
				<input type="text" placeholder="Username" name="username" />
				<button className={`${cl.button}`}>Search</button>
			</form>
			{user && (
				<div className={`${cl.user}`}>
					<div className={`${cl.detail}`}>
						<Avatar src={user.avatar || "./avatar.png"} alt="" />
						<span>{user.username}</span>
					</div>
					<button className={`${cl.button}`} onClick={handleAdd}>
						Add User
					</button>
				</div>
			)}
		</div>
	);
};
