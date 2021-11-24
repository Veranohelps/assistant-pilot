# Transaction Manager

A light weight wrapper around [Knex transactions](https://knexjs.org/#Transactions) providing extra helpers to ease managing transactions spanning several modules across the app

## Usage

create a new transaction manager instance

```TypeScript
const tx = new TransactionManager();

// initialize the transaction
await tx.init();
```

the `@Tx()` parameter decorator does this instantiation and initialization for you when used to provide a tx instance in a controller. And oh, transaction manager instances provisioned this way will automatically be committed once the request completes

```TypeScript
@Patch('transaction')
@HttpCode(HttpStatus.OK)
async doSomething(@Tx() tx: TransactionManager) {
  await this.expeditionService.refreshAllExpeditions(tx);

  return successResponse('ran some stuff in a transaction');
}
```

Database operations can run inside this transaction by providing the instance to the `read` or `write` method provided by the `KnexClient` class

```TypeScript
class UserService {
  constructor(private db: KnexClient<'User'>)

  async changeEmail(tx: TransactionManager, id: string, newEmail: string) {
    const user = await this.db.read(tx).where({ id }).first();

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.db.write(tx).update({ email: newEmail }).where({ id }).cReturning();

    return updatedUser;
  }
}
```

## API

### `init`

initialize the transaction, basically starting the transaction on the database. Not calling this method would cause an error if any database queries attempts to run in it (it doesn't exist).

### `run(promise)`

run callback, commit the transaction if promise resolves or perform a rollback otherwise.

- promise - promise or a function that returns one

```TypeScript
const tx = await TransactionManager.create();

const promiseResult = await tx.run(promise);
```

if promise completes, the transaction gets committed, otherwise it fails

### `addRun`

use this method to associate an external process (in this case anything not running in the database) to this transaction, if the process fails, the transaction fails and gets rolled back. It takes three arguments

- a promise or a function that returns one (the external process to be associated with this transaction)
- a rollback function that gets called with the result of the external process
- an onCommit function that runs after the transaction has been committed

A very good use case for this is say uploading a file to some external storage, lets say an basic endpoint for updating a user's profile picture

- upload file to external storage and retrieve a url to the file
- store the url in the database

```TypeScript
async uploadFile(tx: TransactionManager, file: File) {
  const url = await tx.addRun(
    () => uploadFileToCloud(file), // returns a url
    (url) => deleteFileByUrl(url), // deletes this file using the url
    () => { console.log('committed'); }, // do some logging
  );

  return url;
}

async updateAvatar(tx: TransactionManager, id: string, avatar: string) {
  const updatedUser = await this.db.write(tx).update({ avatar }).where({ id }).cReturning();

  return updatedUser;
}

async updateProfilePicture(tx: TransactionManager, id: string, image: File) {
  const url = await uploadFile(tx, image);
  const updatedUser = await updateAvatar(tx, id, url);

  return updatedUser;
}
```

Now, if for some reason `updateAvatar` fails, the rollback function provided to `tx.addRun` by `uploadFile` will be called and the file will be deleted form the external storage, and if everything is successful, 'committed' will be logged.

### `rollback`

Rollback the transaction and execute all rollback callbacks (provided by `tx.addRun`). Best case scenario, this returns everything to the way it was pre transaction

### `commit`

Commits the transaction and execute all the commit callback (provided by `tx.addRun` and `addCommit`).

### `onCommit`

use this to provide callbacks that will be executed if the transaction is committed. One good use for this is providing callbacks to dispatch notification or logging. Note that the failure or success of `onCommit` callbacks do not affect the transaction. A successfully committed transaction only guarantees that all onCommit callbacks were called.

### `static create`

instantiate and initialize TransactionManager

```TypeScript
// instantiate and initialize
// no need to call tx.init()
const tx = await TransactionManager.create();
```

### `ktx`

get the actual knex transaction instance

### `cache`

returns a CacheManager instance associated with the TransactionManager instance. This is simply is a convenience method

## Usage notes

Anything that mutates the database or an external resource should be done using a transaction and all the helpers TransactionManager provides. To enforce this (for database mutations), the `KnexClient.write` method requires a TransactionManager instance passed as the first argument. For all other mutations outside the database, associate them to the current transaction using `TransactionManager.addRun`.

The TransactionManager represents a single unit of work, and every action (database or external mutations) associated with it during the course of it's life becomes part of that work, with guarantees that failures undoes any changes that have been made. The fact that TransactionManager need not know all the actions comprising the work before hand makes it perfect for handling processes cutting across several modules (and who knows, perhaps micro services in the future) where it would be difficult to determine all that actions to be taken at the point where the process is started.
