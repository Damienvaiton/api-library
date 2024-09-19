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
}

export const bookService = new BookService();
