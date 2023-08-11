const { nanoid } = require("nanoid");
const books = require('./books');

const addBookHandler = (request, h) => {
    let 
    {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    let id = nanoid(10);
    let finished = false;
    if(readPage === pageCount){
        finished = true;
    }
    let insertedAt = new Date().toISOString();
    let updatedAt = insertedAt;

    let newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    
    if(!newBook.name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    if (newBook.readPage > newBook.pageCount) {

        const response = h.response({
          status: 'fail',
          message:'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
      }


      books.push(newBook);
      const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201)
        return response;
    } const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;



}

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = books;
    
    if (name) {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    
    if (reading != null) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }
    
    if (finished != null) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }
    
    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
    });
    
    return response;
}

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    
    const updateAt = new Date().toISOString();
    
    const index = books.findIndex((book) => book.id === id);

    if(index !== -1) {
        if(!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }
        if (readPage > pageCount) {
    
            const response = h.response({
              status: 'fail',
              message:'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
          }

        books[index] = {
            ...books[index], 
                    name, 
                    year, 
                    author, 
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    reading,
                    updateAt
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }           
    
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }
     
     const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
} 

module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }