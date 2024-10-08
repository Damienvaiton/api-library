import { Body, Controller, Delete, Get, Patch, Post, Route, Tags } from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { BookCollectionDTO } from "../dto/bookCollection.dto";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
	@Get("/")
	public async getAllBooks(): Promise<BookDTO[]> {
		return bookService.getAllBooks();
	}

	@Get("/{id}")
	public async getBook(id: number): Promise<BookDTO | null> {
		const book = await bookService.getBook(id);

		if (!book) {
			const error = new Error("Book not found");
			(error as any).status = 404;
			throw error;
		}
		return book;
	}

	//Crée un nouveau livre
	@Post("/")
	public async createBook(@Body() requestBody: BookDTO): Promise<BookDTO> {
		return bookService.createBook(
			requestBody.title,
			requestBody.author?.id || -1,
			requestBody.publish_year,
			requestBody.isbn
		);
	}

	@Patch("/{id}")
	public async updateBook(
		id: number,
		@Body() requestBody: BookDTO
	): Promise<BookDTO | null> {
		return bookService.updateBook(id, requestBody);
	}

	@Delete("/{id}")
	public async deleteBook(id: number): Promise<void> {
		await bookService.deleteBook(id);
	}

	@Get("{id}/books-collection")
	public async getBooksCollectionbyBookId(
		id: number
	): Promise<BookCollectionDTO[]> {
		return bookService.getBooksCollectionbyBookId(id);
	}
}
