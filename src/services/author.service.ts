import { Author } from "../models/author.model";
import { BookService } from "./book.service";
import { BookCollectionService } from "./bookCollection.service";

export class AuthorService {
	// Récupère tous les auteurs
	public async getAllAuthors(): Promise<Author[]> {
		return Author.findAll();
	}

	// Récupère un auteur par ID
	public async getAuthorById(id: number): Promise<Author | null> {
		return Author.findByPk(id);
	}

	// Crée un nouvel auteur
	public async createAuthor(
		firstName: string,
		lastName: string
	): Promise<Author> {
		return Author.create({ first_name: firstName, last_name: lastName });
	}

	// Supprime un auteur par ID
	public async deleteAuthor(id: number): Promise<void> {
		const author = await Author.findByPk(id);
		if (author) {
			const bookserv = new BookService();
			const bookcolserv = new BookCollectionService();
			const books = await bookserv.getAllBooks();
			for (const book of books) {
				if (book.author_id === id) {
					const bookcollections = await bookcolserv.getAllBookCollections();
					for (const bookcollection of bookcollections) {
						if (bookcollection.book_id === book.id) {
							if (bookcollection.available === true) {
								throw new Error(
									`Cannot delete author with id ${id} because book with id ${book.id} is available`
								);
							}
						}
					}
				}
			}
			for (const book of books) {
				if (book.author_id === id) {
					const bookcollections = await bookcolserv.getAllBookCollections();
					for (const bookcollection of bookcollections) {
						if (bookcollection.book_id === book.id) {
							await bookcollection.destroy();
						}
					}
					await book.destroy();
				}
			}
			await author.destroy();
		}
	}

	// Met à jour un auteur
	public async updateAuthor(
		id: number,
		firstName?: string,
		lastName?: string
	): Promise<Author | null> {
		const author = await Author.findByPk(id);
		if (author) {
			if (firstName) author.first_name = firstName;
			if (lastName) author.last_name = lastName;
			await author.save();
			return author;
		}
		return null;
	}
}

export const authorService = new AuthorService();
