const { nanoid } = require('nanoid');
const books = require('./books');

// Add book disini
const addBookHandler = (request, h) => {
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
  const id = nanoid(16);
  // reading coba dulu pake let nanti kalo bisa pake const satuin aja
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  // const { reading } = request.payload;
  if (readPage === pageCount) {
    finished = true;
  }
  const newBooks = {
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
  /* Client tidak melampirkan properti name dan jika
     melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  */
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    books.push(newBooks);
  }
  //   Jika berhasil
  const isSuccess = books.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// const getAllBooksHandler = () => ({
//   status: 'success',
//   data: {
//     books,
//   },
// });
// Read semua
const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;
  let getBook = books;



  if (reading === '1') {
    getBook = books.filter((book) => book.reading == true);
  } if (reading === '0') {
    getBook = books.filter((book) => book.reading == false);
  } else if (finished === '1') {
    getBook = books.filter((book) => book.finished === true);
  } else if (finished === '0') {
    getBook = books.filter((book) => book.finished === false);
  }
  if (name !== undefined) {
    getBook = getBook.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  const response = h.response({
    status: 'success',
    data: {
      books: getBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};
// Read sesuai id nya
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Ubah data
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const updatedAt = new Date().toISOString();
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
  const index = books.findIndex((book) => book.id == id);

  /* Client tidak melampirkan properti name dan jika
   melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
*/
  if (!name) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      // `Gagal menambahkan buku. readPage '${readPage}' tidak boleh lebih besar dari pageCount`,
    });
    response.code(400);
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      // finished,
      reading,
      updatedAt,
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
    // `Gagal memperbarui buku. Id '${id}' tidak ditemukan`,
  });
  response.code(404);
  return response;
};

// Hapus data
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id == id);

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
    message:
    'Buku gagal dihapus. Id tidak ditemukan'
    // `Buku gagal dihapus. Id '${id}' tidak ditemukan`,
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
