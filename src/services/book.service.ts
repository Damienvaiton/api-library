import { BookDTO } from "../dto/book.dto";
import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import { AuthorService } from "./author.service";

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
		if(book.title) bookToUpdate.title = book.title;
		if (book.publish_year) bookToUpdate.publish_year = book.publish_year;
		if (book.isbn) bookToUpdate.isbn = book.isbn;
		if (book.author?.id) bookToUpdate.author_id = book.author.id;
		bookToUpdate.author = author;
		await bookToUpdate.save();
		return bookToUpdate;
	}
}

export const bookService = new BookService();
