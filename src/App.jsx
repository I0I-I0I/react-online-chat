import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import Loading from "./components/UI/loading/Loading";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useChatStore } from "./lib/chatStore";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";

function App() {
	const { currentUser, isLoading, fetchUserInfo } = useUserStore();
	const { chatId } = useChatStore();

	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			fetchUserInfo(user?.uid);
		});

		return () => {
			unSub();
		};
	}, [fetchUserInfo]);

	if (isLoading) return <Loading />;

	return (
		<div className="container">
			{currentUser ? (
				<>
					<List />
					{chatId && <Chat />}
					{chatId && <Detail />}
				</>
			) : (
				<Login />
			)}
			<Notification />
		</div>
	);
}

export default App;
