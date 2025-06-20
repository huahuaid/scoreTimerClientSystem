export type Player = {
	id: number;
	name: string;
	exists: boolean;
	position: 'up' | 'down';
};

export type Zone = "top-left" | "bottom-left" | "top-right" | "bottom-right";
export type Position = {
	x: number;
	y: number;
};