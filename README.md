# Sql Injection

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

## Summary

Example of a simple sql injection in a server and client application.

A bun server hosts the web server and a website is the client which connects to the server. The client can send the server a vulnerable SQL query to login as any user.

## Explanation

The servers code is in `server.ts` and the client code is in `client.ts`.

The server has a list of users and their passwords stored in a database. The client sends a username and password to the server to login and retrieve user information.

Since the server does not sanitize the input from the client, it is vulnerable to an SQL injection, where specific usernames and passwords are entered to bypass authentication and gain unauthorized access to user data.

```sql
SELECT * FROM users WHERE username = '${username}' AND password = '${password}';
```

The server executes the above query

If a user enters:
username: A'--
password: anything

Then the query becomes:

```sql
SELECT * FROM users WHERE username = 'A'--' AND password = '${password}';
```

Where it will login and get the user data with the username of 'A' and ignore the password check due to the SQL comment `--` which comments out the rest of the query.

## Fixing

This is a very simple issue to fix, one simple way to is to use prepared statements where the query is defined with placeholders and the parameters are passed separately, preventing the injection of malicious SQL code.

```diff
- const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`
+ const query = `SELECT * FROM users WHERE username = $1 AND password = $2;`
console.log('query:', query)

- const res = await client.query(query)
+ const res = await client.query(query, [username, password])
```
