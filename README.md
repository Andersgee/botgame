# botgame

Boilerplate from Create T3 App

## create a local proxy to mysql database on planetscale

```sh
pscale connect botgame main --port 3309
```

## start nextjs dev server

```sh
yarn dev
```

## Inspect database contents (ui)

```sh
yarn prisma studio #simple ui
pscale shell botgame main #normal shell
```

## References

[setup-next-js-with-prisma-and-planetscale](https://planetscale.com/blog/how-to-setup-next-js-with-prisma-and-planetscale)
