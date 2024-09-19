import { BookCollection } from '../models/bookCollection.model';



export class BookCollectionService {
    public async getAllBookCollections(): Promise<BookCollection[]> {
        return BookCollection.findAll();
    }
     
}

export const bookCollectionService = new BookCollectionService();