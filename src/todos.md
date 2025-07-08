/ Bugs

- [x] Fix date entries to be unanymous
- [x] URL currently are missing / which breaks the API
- [] Currencies added, after removal stay inside of user's data - On currency removal without previously setting it to non-favorite also remove from the user's currencies db column

/ New Ideas / Improvements

- [] Redux to make state updates across the app more smooth and consistent
- [] Add ability to delete transaction / for business with each delete also remove images which were previously uploaded to the cloud \*somewhere
- Add validation errors for each form
- [] Recognize if note contains a possible words which would make the transaction business context - and notify user to make sure it's not a business transaction
- [] Open receipts route
- [] Transaction categories
- [] Delete old receipt when new one gets uploaded to the same transaction
- [] Relocate receipt upload errors from the server onto frontend for info
- [] Email authentication with magic link or codes

/ Done

- [x] Fully integrate errros into currencies forms
- [x] Add toaster or other type of notifiers to alert user on certain interactions
- [x] Transaction payment method cash/card
- [x] Re-write currencies completely, do not allow manual creation rather check which user would like to user from a globally accessible currencies
- [x] Open DEV branch
- [x] Add ability to open mobile camera to capture a receipt
- [x] Add ability to add documents to business transactions
- [x] Load only user related transactions no filter on the frontend
- [x] Add ability to pick favorite currencies as a user / Select DONE - Fetching options thrhgout the app remaining
- [x] Change all record ids into nanoid
- [x] Fully integrate errors in transactions forms
- [x] Swap local db to Supabase
  - [x] Swap backend to align with Supabase
  - [x] Swap currencies api and frontend
  - [x] Swap transactions api and frontend
  - [x] Swap users api and frontend
  - [x] Swap users api and frontend
- [x] Transform TanStack -> RTK in all places where needed
  - [x] Transactions
  - [x] Login
  - [x] Registration
  - [x] Currencies
