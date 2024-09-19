import { BookCollection } from "../models/bookCollection.model";
import { BookService } from "./book.service";

export class BookCollectionService {
	public async getAllBookCollections(): Promise<BookCollection[]> {
		return BookCollection.findAll();
	}

	public async getBookCollectionById(
		id: number
	): Promise<BookCollection | null> {
		return BookCollection.findByPk(id);
	}

	public async createBookCollection(
		book_id: number,
		available: boolean,
		state: number
	): Promise<BookCollection> {
		const bservice = new BookService();
		const book = await bservice.getBook(book_id);
		if (!book) {
			throw new Error(`Book with id ${book_id} not found`);
		}
		return BookCollection.create({
			book_id: book_id,
			available: available,
			state: state,
		});
	}
}

export const bookCollectionService = new BookCollectionService();
