import React, { Component } from "react";

export default class Private extends Component {
	state = {
		message: "",
	};

	componentDidMount() {
		fetch("/private", {
			headers: {
				Authorization: `Bearer ${this.props.auth.getAccessToken()}`,
			},
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				throw new Error("Network response was not ok");
			})
			.then((res) => this.setState({ message: res.message }))
			.catch((error) => this.setState({ error: error.message }));
	}

	render() {
		return <p>{this.state.message}</p>;
	}
}
