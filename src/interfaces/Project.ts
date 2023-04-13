export interface ProjectData {
	title: string;
	description: string;
};

export interface Project extends ProjectData {
  id: string
  authorId: string
}