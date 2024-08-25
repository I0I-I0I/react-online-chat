import cl from "./Avatar.module.css";

export const Avatar = ({ className, ...props }) => {
	return <img className={`${cl.avatar} ${className}`} {...props} />;
};
