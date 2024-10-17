import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Path,
	Post,
	Route,
	Security,
	Tags,
} from "tsoa";
import {
	BookCollectionInputDTO,
	BookCollectionInputPatchDTO,
	BookCollectionOutputDTO,
} from "../dto/bookCollection.dto";
import { bookCollectionService } from "../services/bookCollection.service";
@Route("book-collections")
@Tags("BookCollections")
@Security("jwt")
export class BookCollectionController extends Controller {
	@Get("/")
	@Security("jwt", ["book-collections:read"])
	public async getAllBooksCollection(): Promise<BookCollectionOutputDTO[]> {
		return bookCollectionService.getAllBookCollections();
	}

	@Get("{id}")
	public async getBookCollection(
		@Path("id") id: number
	): Promise<BookCollectionOutputDTO> {
		return bookCollectionService.getBookCollectionById(id);
	}

	@Post("/")
	@Security("jwt", ["book-collections:create"])
	public async postBookCollection(
		@Body() requestBody: BookCollectionInputDTO
	): Promise<BookCollectionOutputDTO> {
		return bookCollectionService.createBookCollection(
			requestBody.book_id,
			requestBody.available,
			requestBody.state
		);
	}

	@Patch("{id}")
	@Security("jwt", ["book-collections:update"])
	public async patchBookCollection(
		@Path("id") id: number,
		@Body() requestBody: BookCollectionInputPatchDTO
	): Promise<BookCollectionOutputDTO> {
		return bookCollectionService.updateBookCollection(
			id,
			requestBody.book_id,
			requestBody.available,
			requestBody.state
		);
	}

	@Delete("{id}")
	@Security("jwt", ["book-collections:delete"])
	public async deleteBookCollection(@Path("id") id: number): Promise<void> {
		await bookCollectionService.deleteBookCollection(id);
	}
}
