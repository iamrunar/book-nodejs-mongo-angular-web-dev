# Task

## Text
Create an app "Word counter" which
1. The system has users. API `token = POST /users/new?name=<>` or `token = POST /user/login?name=<>`
2. Each user has an word collection. Contract `user => word: count`.
3. Each users can add:
    a. a word to their own collection. API `POST /words/single?word=<>`.
    b. words from a document. API `POST /words/document` body: `text` (text should be separated by comma).
    c. a web document (by URL). Each word from the document will be added to the user's word collection. `POST /words/external` body `{ url: <url> }``.
4. In addition, each user can: 
    a. retrieve the count of specific word or words in their collection. API `resp = GET /words/stats?word=<>[&word=<>...]` resp is `{words: [{word:<>, count:<>}], count}`.
    b. retrieve the total count of their words in the same way as 4a. API `resp = GET /words/stats` resp is `{ count: <> }`.

For the user API, each request must include a header `user_token` (see the first point), otherwise, a 403 error.

## Technologies

1. Nodejs
2. MongoDb