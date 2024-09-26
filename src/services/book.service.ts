import { BookDTO } from "../dto/book.dto";
import { BookCollectionDTO } from "../dto/bookCollection.dto";
import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import { AuthorService } from "./author.service";
import { BookCollectionService } from "./bookCollection.service";

export class BookService {
	public async getAllBooks(): Promise<Book[]> {
		return Book.findAll({
			include: [
				{
					model: Author,
					as: "author",
				},
			],
		});
	}

	public async getBook(id: number): Promise<Book | null> {
		return Book.findByPk(id);
	}

	public async createBook(
		title: string,
		authorId: number,
		publish_year: number,
		isbn: string
	): Promise<Book> {
		const ahservice = new AuthorService();
		const author = await ahservice.getAuthorById(authorId);
		if (!author) {
			throw new Error(`Author with id ${authorId} not found`);
		}
		return Book.create({
			title: title,
			author_id: authorId,
			publish_year: publish_year,
			isbn: isbn,
			author: author,
		});
	}

	public async updateBook(id: number, book: BookDTO): Promise<Book | null> {
		const bookToUpdate = await Book.findByPk(id);
		if (!bookToUpdate) {
			return null;
		}
		const ahservice = new AuthorService();
		const author = await ahservice.getAuthorById(book.author?.id || -1);
		if (!author) {
			throw new Error(`Author with id ${book.author?.id} not found`);
		}
		if (book.title) bookToUpdate.title = book.title;
		if (book.publish_year) bookToUpdate.publish_year = book.publish_year;
		if (book.isbn) bookToUpdate.isbn = book.isbn;
		if (book.author?.id) bookToUpdate.author_id = book.author.id;
		bookToUpdate.author = author;
		await bookToUpdate.save();
		return bookToUpdate;
	}

	public async deleteBook(id: number): Promise<void> {
		const book = await Book.findByPk(id);
		if (book) {
			const bookcolserv = new BookCollectionService();
			const bookcollections = await bookcolserv.getAllBookCollections();
			for (const bookcollection of bookcollections) {
				if (bookcollection.book_id === id) {
					if (bookcollection.available === true) {
						throw new Error(
							`Cannot delete book with id ${id} because it is available`
						);
					}
				}
			}
			for (const bookcollection of bookcollections) {
				if (bookcollection.book_id === id) {
					await bookcollection.destroy();
				}
			}
			await book.destroy();
		} else {
			throw new Error(`Book with id ${id} not found`);
		}
	}

	public async getBooksCollectionbyBookId(
		id: number
	): Promise<BookCollectionDTO[]> {
		const bookcolserv = new BookCollectionService();
		const bookcollections = await bookcolserv.getAllBookCollections();
		const bookCollectionsByBookId = bookcollections.filter(
			(bookcollection) => bookcollection.book_id === id
		);
		return bookCollectionsByBookId;
	}
}

export const bookService = new BookService();
