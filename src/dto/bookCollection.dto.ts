import { BookState } from "../models/bookCollection.model";

export interface BookCollectionDTO {
	book_id: number;
	available: boolean;
	state: BookState;
}
