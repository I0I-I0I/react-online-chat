import { auth, db } from "../../lib/firebase";
import { Avatar } from "../UI/avatar/Avatar";
import cl from "./Detail.module.css";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
	const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
		useChatStore();
	const { currentUser } = useUserStore();

	const handlerLogout = () => {
		auth.signOut();
	};

	const handleBlock = async () => {
		if (!user) return;

		const userDocRef = doc(db, "users", currentUser.id);

		try {
			await updateDoc(userDocRef, {
				blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
			});
			changeBlock();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={`${cl.detail}`}>
			<div className={`${cl.user}`}>
				<Avatar src={user?.avatar || "./avatar.png"} />
				<h2>{user.username}</h2>
				<p>Lorem ipsum dolor sit.</p>
			</div>
			<div className={`${cl.info}`}>
				<div className={`${cl.option}`}>
					<div className={`${cl.title}`}>
						<span>Chat Settings</span>
						<img src="./arrowUp.png" alt="" />
					</div>
				</div>
				<div className={`${cl.option}`}>
					<div className={`${cl.title}`}>
						<span>Privacy & Help</span>
						<img src="./arrowUp.png" alt="" />
					</div>
				</div>
				<div className={`${cl.option}`}>
					<div className={`${cl.title}`}>
						<span>Shared photos</span>
						<img src="./arrowDown.png" alt="" />
					</div>
					<div className={`${cl.photos}`}>
						<div className={`${cl.photoItem}`}>
							<div className={`${cl.photoDetail}`}>
								<img
									src="https://www.imgacademy.com/sites/default/files/styles/scale_1700w/public/2020-04/OG-boarding-school.jpg?itok=vCBnXXAJ"
									alt=""
								/>
							</div>
						</div>
						<div className={`${cl.photoItem}`}>
							<div className={`${cl.photoDetail}`}>
								<img
									src="https://www.imgacademy.com/sites/default/files/styles/scale_1700w/public/2020-04/OG-boarding-school.jpg?itok=vCBnXXAJ"
									alt=""
								/>
							</div>
						</div>
						<div className={`${cl.photoItem}`}>
							<div className={`${cl.photoDetail}`}>
								<img
									src="https://www.imgacademy.com/sites/default/files/styles/scale_1700w/public/2020-04/OG-boarding-school.jpg?itok=vCBnXXAJ"
									alt=""
								/>
							</div>
						</div>
						<div className={`${cl.photoItem}`}>
							<div className={`${cl.photoDetail}`}>
								<img
									src="https://www.imgacademy.com/sites/default/files/styles/scale_1700w/public/2020-04/OG-boarding-school.jpg?itok=vCBnXXAJ"
									alt=""
								/>
							</div>
						</div>
						<div className={`${cl.photoItem}`}>
							<div className={`${cl.photoDetail}`}>
								<img
									src="https://www.imgacademy.com/sites/default/files/styles/scale_1700w/public/2020-04/OG-boarding-school.jpg?itok=vCBnXXAJ"
									alt=""
								/>
							</div>
						</div>
						<div className={`${cl.photoItem}`}>
							<div className={`${cl.photoDetail}`}>
								<img
									src="https://www.imgacademy.com/sites/default/files/styles/scale_1700w/public/2020-04/OG-boarding-school.jpg?itok=vCBnXXAJ"
									alt=""
								/>
							</div>
						</div>
					</div>
				</div>
				<div className={`${cl.option}`}>
					<div className={`${cl.title}`}>
						<span>Shared Files</span>
						<img src="./arrowUp.png" alt="" />
					</div>
				</div>
			</div>
			<div className={`${cl.bottom}`}>
				<button className={`${cl.button}`} onClick={handleBlock}>
					{isCurrentUserBlocked
						? "You are Blocked!"
						: isReceiverBlocked
							? "User blocked"
							: "Block user"}
				</button>
				<button className={`${cl.logoutButton}`} onClick={handlerLogout}>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Detail;
