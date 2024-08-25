import cl from "./ButtonIcon.module.css";

export const ButtonIcon = ({ className, src, ...props }) => {
	return (
		<button
			className={`${cl.buttonIcon} ${className}`}
			style={{ backgroundImage: `url(${src})` }}
			{...props}
		/>
	);
};
