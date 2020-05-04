import auth0 from "auth0-js";

export default class Auth {
	constructor(history) {
		this.history = history;
		this.userProfle = null;
		this.auth0 = new auth0.WebAuth({
			domain: process.env.REACT_APP_AUTH0_DOMAIN,
			clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
			redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
			audience: process.env.REACT_APP_AUTH0_AUDIENCE,
			responseType: "token id_token",
			scope: "openid profile email",
		});
	}

	login = () => {
		this.auth0.authorize();
	};

	handleAuthentication = () => {
		this.auth0.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
				this.history.push("/");
			} else if (err) {
				this.history.push("/");
				alert(
					`Error: ${err.error}. Check the console for further details. `
				);
				console.log(err);
			}
		});
	};

	setSession = (authResult) => {
		//Set the time that access token will expire
		const expireAt = JSON.stringify(
			authResult.expiresIn * 1000 + new Date().getTime()
		);
		localStorage.setItem("access_token", authResult.accessToken);
		localStorage.setItem("id_token", authResult.idToken);
		localStorage.setItem("expires_at", expireAt);
	};

	isAuthenticated() {
		const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
		return new Date().getTime() < expiresAt;
	}

	logout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("id_token");
		localStorage.removeItem("expires_at");
		this.userProfle = null;
		this.auth0.logout({
			clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
			returnTo: "http://localhost:3000",
		});
		//this.history.push("/");
	};

	getAccessToken = () => {
		const accessToken = localStorage.getItem("access_token");
		if (!accessToken) {
			throw new Error("No access token found");
		}
		return accessToken;
	};

	getProfile = (callback) => {
		if (this.userProfle) return callback(this.userProfle);
		this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
			if (profile) {
				this.userProfle = profile;
			}
			callback(profile, err);
		});
	};
}
