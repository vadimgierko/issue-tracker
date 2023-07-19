export namespace Card {
    export interface Style {
        padding?: string;
        width?: string;
        marginLeft?: string | number,
		marginRight?: string | number,
    }

    export interface Card {
        icon: JSX.Element;
        header: string;
        paragraph?: string;
    }
}