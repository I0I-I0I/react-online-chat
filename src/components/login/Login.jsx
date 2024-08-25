import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload";
import { Avatar } from "../UI/avatar/Avatar";
import cl from "./Login.module.css";

const Login = () => {
	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	});

	const [loading, setLoading] = useState(false);

	const handleAvatar = (element) => {
		if (element.target.files[0]) {
			setAvatar({
				file: element.target.files[0],
				url: URL.createObjectURL(element.target.files[0]),
			});
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.target);
		const { email, password } = Object.fromEntries(formData);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			toast.success("You're logged in");
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.target);

		const { username, email, password } = Object.fromEntries(formData);

		let imgUrl = null;

		try {
			if (avatar.file) {
				imgUrl = await upload(avatar.file);
			}

			const res = await createUserWithEmailAndPassword(auth, email, password);

			await setDoc(doc(db, "users", res.user.uid), {
				username,
				email,
				avatar: imgUrl || "avatar.png",
				id: res.user.uid,
				blocked: [],
			});

			await setDoc(doc(db, "userchats", res.user.uid), {
				chats: [],
			});

			toast.success("Account created! You can login now!");
		} catch (err) {
			console.log(err);
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`${cl.login}`}>
			<div className={`${cl.item}`}>
				<h2>Welcome back</h2>
				<form className={`${cl.form}`} onSubmit={handleLogin}>
					<input type="text" placeholder="Email" name="email" />
					<input type="text" placeholder="Password" name="password" />
					<button disabled={loading}>
						{loading ? "Loading..." : "Sing In"}
					</button>
				</form>
			</div>
			<div className={`${cl.separator}`}></div>
			<div className={`${cl.item}`}>
				<h2>Create an Account</h2>
				<form onSubmit={handleRegister} className={`${cl.form}`} action="">
					<label htmlFor="file">
						<Avatar src={avatar.url || "./avatar.png"} alt="" />
						Upload an image
						<input
							type="file"
							id="file"
							style={{ display: "none" }}
							onChange={handleAvatar}
						/>
					</label>
					<input type="text" placeholder="Username" name="username" />
					<input type="text" placeholder="Email" name="email" />
					<input type="password" placeholder="Password" name="password" />
					<button disabled={loading}>
						{loading ? "Loading..." : "Sing Up"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
