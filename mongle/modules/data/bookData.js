module.exports = 
    (rawBookData) => {
        bookData = {
            "authors": rawBookData.authors,
            "contents": rawBookData.contents,
            "datetime": rawBookData.datetime,
            "isbn": rawBookData.isbn,
            "publisher": rawBookData.publisher,
            "thumbnail": rawBookData.thumbnail,
            "title": rawBookData.title
        
        };
        return bookData;
    };