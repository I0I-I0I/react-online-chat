import cl from "./Input.module.css";

export const Input = ({ className, ...props }) => {
	return <input className={`${cl.input} ${className}`} {...props} />;
};
