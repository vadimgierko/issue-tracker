export namespace Project {
	// this is what forms use:
	export interface Data {
		title: string;
		description: string;
	}

	export interface Project extends Data {
		id: string;
		authorId: string;
	}
}
