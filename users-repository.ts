interface IUsersRepository {
    find(username: string): User;
    push(user: User): Number;
  }

  type User = {
    username: string;
  };
  
  export class InMemoryUsersRepository implements IUsersRepository {

    users : User[] = [];

    find(username: string): User {
      return this.users.find(user => user.username === username);
    }

    push(user: User) {
        return this.users.push(user);
    }
  };
