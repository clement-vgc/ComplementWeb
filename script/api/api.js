class Api {
	constructor(baseUrl = "http://localhost:3000") {
		this.baseUrl = baseUrl;
	}

	async request(endpoint, options = {}) {
		const url = `${this.baseUrl}${endpoint}`;

		let response;
		try {
			response = await fetch(url, {
				headers: {
					"Content-Type": "application/json",
					...(options.headers || {})
				},
				...options
			});
		} catch (error) {
			throw new Error(`Impossible de joindre l'API (${url}) : ${error.message}`);
		}

		if (!response.ok) {
			throw new Error(`Erreur API ${response.status} sur ${endpoint}`);
		}

		const text = await response.text();
		return text ? JSON.parse(text) : null;
	}

	getTowerTypes() {
		return this.request("/tower_types");
	}

	getTowers() {
		return this.request("/towers");
	}

	getTowerById(id) {
		return this.request(`/towers/${id}`);
	}

	getSpecialSkills() {
		return this.request("/special_skills");
	}

	getTowerSkills() {
		return this.request("/tower_skills");
	}

	getTowerSkillsByTowerId(towerId) {
		return this.request(`/tower_skills?towerId=${towerId}`);
	}
}

export const api = new Api();
export { Api };
