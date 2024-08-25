import cl from "./UserInfo.module.css";

import { Avatar } from "../../UI/avatar/Avatar";
import { ButtonIcon } from "../../UI/buttonIcon/ButtonIcon";
import { useUserStore } from "../../../lib/userStore";

const UserInfo = () => {
	const { currentUser } = useUserStore();

	return (
		<div className={`${cl.userInfo}`}>
			<div className={`${cl.user}`}>
				<Avatar
					src={currentUser.avatar || "./avatar.png"}
					className={`${cl.avatar}`}
				/>
				<h2>{currentUser.username}</h2>
			</div>
			<div className={`${cl.icons}`}>
				<ButtonIcon src="/more.png" />
				<ButtonIcon src="/video.png" />
				<ButtonIcon src="/edit.png" />
			</div>
		</div>
	);
};

export default UserInfo;
