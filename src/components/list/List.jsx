import UserInfo from "./userInfo/UserInfo";
import ChatList from "./chatList/ChatList";

import cl from "./List.module.css";

const List = () => {
	return (
		<div className={`${cl.list}`}>
			<UserInfo />
			<ChatList />
		</div>
	);
};

export default List;
