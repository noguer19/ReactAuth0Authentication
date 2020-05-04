import React, { Component } from "react";

export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			error: "",
		};
	}

	componentDidMount() {
		this.loadUserProfile();
	}

	loadUserProfile() {
		this.props.auth.getProfile((profile, error) => {
			this.setState({ profile: profile, error: error });
		});
	}

	render() {
		const { profile } = this.state;

		return (
			<>
				<h1>Profile</h1>
				<p>{profile?.nickname}</p>
				<h3>{profile?.name}</h3>
				<p>{profile?.email}</p>
				<img
					style={{ maxWidth: 50, maxHeight: 50 }}
					src={profile?.picture}
					alt="profile pic"
				></img>
				<pre>{JSON.stringify(profile, null, 2)}</pre>
			</>
		);
	}
}
