# HAPI

This is simple API for fetching information about the user from the Discord API, and uptime check for different sites.

## Endpoints

### Public

#### `GET /v1/user/:id`
Fetch information about the user with the given ID.


#### `GET /v1/presence/:id`
Fetch the presence of the user with the given ID.


#### `POST /v1/uptime`
Check the uptime of the given URL.

For uptime checks, you need to provide a JSON object with the following fields:

- `url`: The URL to check.
- `webhook`: The Discord webhook to send the result to.
- `userID`: The user ID to send the ID and password, you can use them for change or delete checker.

```bash
$ curl -X POST -d '{ "url": "google.com", "webhook": "discord.com/api/webhooks/...", "userID": "991777093312585808" }' https://example.com/v1/uptime
```

### Authenticated

#### Authorization

To authenticate, you need to provide a bearer token in the `Authorization` header.

```bash
$ curl -H { "Authorization": "<password>" } ...
```

#### `POST /v1/uptime/webhook`

Change the webhook for the uptime checker.

For changing the webhook, you need to provide a JSON object with the following fields:
- `id`: The ID of the site.
- `url`: The new webhook URL.

```bash
$ curl -X POST -H { "Authorization": "<password>" } -d '{ "id": "...", "url": "discord.com/api/webhooks/..." }' https://example.com/v1/uptime/webhook
```

#### `POST /v1/uptime/delete/:id`

Delete the uptime checker by ID.

```bash
$ curl -X POST -H { "Authorization": "<password>" } https://example.com/v1/uptime/delete/...
```

### Private

#### `GET /v1/uptime/message/:id`
Send the uptime message, about site status, by webhook.

#### `GET /v1/uptime/ping/:id`
Ping the site by ID.

#### `GET /v1/uptime/pingAll`
Ping all sites.