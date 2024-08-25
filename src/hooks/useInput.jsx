import { useState } from "react";

function useInput(defaulValue) {
	const [value, setValue] = useState(defaulValue);

	const onChange = (element) => {
		setValue(element.target.value);
	};

	return [
		{
			value,
			onChange,
		},
		setValue,
	];
}

export default useInput;
