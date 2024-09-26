import { Body, Controller, Get, Patch, Post, Route, Tags } from "tsoa";
import {
	bookCollectionService,
	BookCollectionService,
} from "../services/bookCollection.service";
import { BookCollectionDTO } from "../dto/bookCollection.dto";

@Route("book-collections")
@Tags("BookCollections")
export class BookCollectionController extends Controller {
	@Get("/")
	public async getAllBookCollections(): Promise<BookCollectionDTO[]> {
		return bookCollectionService.getAllBookCollections();
	}

	@Get("/{id}")
	public async getBookCollection(
		id: number
	): Promise<BookCollectionDTO | null> {
		return bookCollectionService.getBookCollectionById(id);
	}

	@Post("/")
	public async createBookCollection(
		@Body() requestBody: BookCollectionDTO
	): Promise<BookCollectionDTO> {
		return bookCollectionService.createBookCollection(
			requestBody.book_id,
			requestBody.available,
			requestBody.state
		);
	}

	@Patch("/{id}")
	public async updateBookCollection(
		id: number,
		@Body() requestBody: BookCollectionDTO
	): Promise<BookCollectionDTO | null> {
		return bookCollectionService.updateBookCollection(id, requestBody);
	}


}
