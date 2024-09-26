import { BookCollectionDTO } from "../dto/bookCollection.dto";
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

	public async updateBookCollection(
		id: number,
		bookCollection: BookCollectionDTO
	): Promise<BookCollection | null> {
		const bookCollectionToUpdate = await BookCollection.findByPk(id);
		if (!bookCollectionToUpdate) {
			throw new Error(`BookCollection with id ${id} not found`);
		}
		if (bookCollection.book_id) {
			const bservice = new BookService();
			const book = await bservice.getBook(bookCollection.book_id);
			if (!book) {
				throw new Error(`Book with id ${bookCollection.book_id} not found`);
			}
			bookCollectionToUpdate.book_id = bookCollection.book_id;
		}
		console.log(bookCollection);
		if (bookCollection.available) console.log(bookCollection.available);
		bookCollectionToUpdate.available = bookCollection.available;
		if (bookCollection.state) console.log(bookCollection.state);
		bookCollectionToUpdate.state = bookCollection.state;
		await bookCollectionToUpdate.save();

		return bookCollectionToUpdate;
	}

	public async deleteBookCollection(id: number): Promise<void> {
		const bookCollection = await BookCollection.findByPk(id);
		if (bookCollection) {
			await bookCollection.destroy();
		}
	}
}

export const bookCollectionService = new BookCollectionService();
