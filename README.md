# botgame

Boilerplate from Create T3 App

## create a local proxy to mysql database on planetscale

```bash
pscale connect botgame dev --port 3309
#pscale connect botgame main --port 3309
```

## start nextjs dev server

```bash
yarn dev
```

## Inspect database contents (ui)

```bash
yarn prisma studio
#or
pscale shell botgame dev
#pscale shell botgame main
```

## sync database with prisma schema

run after changing prisma/schema.prisma

```bash
yarn prisma db push
```

## References

[setup-next-js-with-prisma-and-planetscale](https://planetscale.com/blog/how-to-setup-next-js-with-prisma-and-planetscale)
